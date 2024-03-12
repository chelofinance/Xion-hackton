set -e

NETWORK=$1
if [ "$NETWORK" = "xion-testnet" ]; then
    DENOM="uxion";
    ICA_CONTROLLER_CODE_ID=59;
    CONNECTION_ID="connection-53";
    COUNTER_PARTY_CONNECTION_ID="connection-2398";
elif [ "$NETWORK" = "osmosis-testnet" ]; then
    DENOM="uosmo";
    ICA_CONTROLLER_CODE_ID=0 ;
    CONNECTION_ID="connection-0"; # ToDo
    COUNTER_PARTY_CONNECTION_ID="connection-0"; # ToDo
elif [ "$NETWORK" = "archway-testnet" ]; then
    DENOM="aconst";
    ICA_CONTROLLER_CODE_ID=2142;
    CONNECTION_ID="connection-81"; # https://docs.archway.io/resources/ibc-channels
    COUNTER_PARTY_CONNECTION_ID="connection-1427";
else 
    echo "Please provide a correct NETWORK.";
    exit 1;
fi
echo "NETWORK: $NETWORK"
echo "DENOM: $DENOM"

yarn

cd ../contracts/proxy
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
PROXY_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/proxy.wasm --network $NETWORK | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$PROXY_CODEID" ]; then echo "Failed to get PROXY_CODEID"; exit 1; fi
echo "Proxy CodeID: $PROXY_CODEID"
PROXY_CONTRACT=$(yarn start --action instantiate --code-id $PROXY_CODEID --message '{}' --network $NETWORK| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
echo "Proxy Contract: $PROXY_CONTRACT"

MY_WALLET_ADDRESS=$(yarn start --action address --network $NETWORK | grep 'data: ' | awk -F'"' '{print $2}')
if [ -z "$MY_WALLET_ADDRESS" ]; then echo "Failed to get MY_WALLET_ADDRESS"; exit 1; fi
echo "My Wallet Address: $MY_WALLET_ADDRESS"

# Send 1 token through proxy, back to myself
yarn start --action execute --contract $PROXY_CONTRACT --network $NETWORK --message '{ "contract_addr": "'$MY_WALLET_ADDRESS'", "payload": {"send_token":{"funds": [{"amount": "1", "denom": "'$DENOM'"}]}}}' --funds 1

cd ../contracts/multisig
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
MULTISIG_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/multisig.wasm --network $NETWORK | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$MULTISIG_CODEID" ]; then echo "Failed to get MULTISIG_CODEID"; exit 1; fi
echo "Multisig CodeID: $MULTISIG_CODEID"

cd ../contracts/multisig-ica-factory
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
MULTISIG_ICA_FACTORY_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/multisig_ica_factory.wasm --network $NETWORK | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$MULTISIG_ICA_FACTORY_CODEID" ]; then echo "Failed to get MULTISIG_ICA_FACTORY_CODEID"; exit 1; fi
echo "Multisig ICA Factory CodeID: $MULTISIG_ICA_FACTORY_CODEID"
MULTISIG_ICA_FACTORY_CONTRACT=$(yarn start --action instantiate --code-id $MULTISIG_ICA_FACTORY_CODEID --message '{"cw3_multisig_code_id": '"$MULTISIG_CODEID"',"cw_ica_controller_code_id": '$ICA_CONTROLLER_CODE_ID', "proxy": "'$PROXY_CONTRACT'"}' --network $NETWORK| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
if [ -z "$MULTISIG_ICA_FACTORY_CONTRACT" ]; then echo "Failed to get MULTISIG_ICA_FACTORY_CONTRACT"; exit 1; fi
echo "Multisig ICA Factory Contract: $MULTISIG_ICA_FACTORY_CONTRACT"

# Testing factory
TX_HASH=$(yarn start --action execute --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"deploy_multisig_ica": {"channel_open_init_options":{"connection_id":"'$CONNECTION_ID'","counterparty_connection_id":"'$COUNTER_PARTY_CONNECTION_ID'"},"multisig_instantiate_msg":{"max_voting_period":{"time":36000},"proxy":"'$PROXY_CONTRACT'","threshold":{"absolute_count":{"weight":1}},"voters":[{"addr":"'$MY_WALLET_ADDRESS'","weight":1}]},"salt":"'$(date +%s)'"}}' | grep "transaction:" | awk -F"'" '{print $2}')
echo "Transaction: $TX_HASH"

CHANNEL_INIT_OUTPUT=$(yarn start --action events --network $NETWORK --hash $TX_HASH)

SRC_CHANNEL_ID=$(echo $CHANNEL_INIT_OUTPUT | awk -F'"channel_id"' '{print $2}'|awk -F'"' '{print $4}')
echo "SRC_CHANNEL_ID: $SRC_CHANNEL_ID"

QUERY_OUTPUT=$(yarn start --action query --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"query_multisig_by_creator": "'$MY_WALLET_ADDRESS'"}')
echo "Query output: $QUERY_OUTPUT"
EXAMPLE_MULTISIG_CONTRACT=$(echo $QUERY_OUTPUT | grep '"multisigs":' | awk -F '[][]' '{split($2,a,","); print a[length(a)]}' | awk '{gsub(/"/,"")}1')
EXAMPLE_ICA_CONTROLLER_CONTRACT=$(echo $QUERY_OUTPUT | grep '"controllers":' | awk -F '[][]' '{split($4,a,","); print a[length(a)]}' | awk '{gsub(/"/,"")}1')
if [ -z "$EXAMPLE_MULTISIG_CONTRACT" ]; then echo "Failed to get EXAMPLE_MULTISIG_CONTRACT"; exit 1; fi
if [ -z "$EXAMPLE_ICA_CONTROLLER_CONTRACT" ]; then echo "Failed to get EXAMPLE_ICA_CONTROLLER_CONTRACT"; exit 1; fi
echo "Example Multisig Contract: $EXAMPLE_MULTISIG_CONTRACT"
echo "Example ICA Controller Contract: $EXAMPLE_ICA_CONTROLLER_CONTRACT"

# -----------------------------------------------
# cw3FixedMultisig.codeId: 2157
# icaFactory.address: archway1zvc6lv6wv77xenckrgalcfaz2rdg2wqhuvmetpgswjwqql3cm2rqk30k9f
# proxyMultisig.address: archway1qwhqja6y23yr242pewwaprwgy54kqm74n4egxwp5jn60t6kkd4kqg0z5px
# -----------------------------------------------
#  - ica_controller: 2142
#  - proxy: 2156
#  - multisig: 2157
#  - factory: 2158
# -----------------------------------------------
#  - factory: archway1zvc6lv6wv77xenckrgalcfaz2rdg2wqhuvmetpgswjwqql3cm2rqk30k9f
#  - proxy: archway1qwhqja6y23yr242pewwaprwgy54kqm74n4egxwp5jn60t6kkd4kqg0z5px
#  - example_multisig: archway1ja8r6mjkztc77k9px2jqlyzzfz7jq8jd6xs94p97x327y0yuxeusz5975s
#  - example_ica_controller: archway1488c9a69ykrhe9gv68uh0m7ncgx0xnkz464mumt2tyrkvthum6asrnrtc4
# EXAMPLE_ICA_CONTROLLER_CONTRACT="archway1488c9a69ykrhe9gv68uh0m7ncgx0xnkz464mumt2tyrkvthum6asrnrtc4"
# SRC_CHANNEL_ID="channel-81"
echo '--------------------------------------------------------------'
echo 'EXAMPLE_ICA_CONTROLLER_CONTRACT="'$EXAMPLE_ICA_CONTROLLER_CONTRACT'" SRC_CHANNEL_ID="'$SRC_CHANNEL_ID'" ./create.sh'
echo '--------------------------------------------------------------'
read -p "Run the command above in the relayer and press Enter to continue..."

yarn start --action query --contract $EXAMPLE_ICA_CONTROLLER_CONTRACT --network archway-testnet --message '{"get_contract_state": {}}'

SECOND_MEMBER_ADDRESS=$(env MNEMONIC="aware clay winner rebuild aerobic first relief scare disorder desk trash cat" yarn start --action address --network $NETWORK | grep 'data: ' | awk -F'"' '{print $2}')
if [ -z "$SECOND_MEMBER_ADDRESS" ]; then echo "Failed to get SECOND_MEMBER_ADDRESS"; exit 1; fi
echo "Second Member Address: $SECOND_MEMBER_ADDRESS"

# Testing multisig through proxy
yarn start --action execute --contract $PROXY_CONTRACT --network $NETWORK --message '{"contract_addr":"'$EXAMPLE_MULTISIG_CONTRACT'","payload":{"multisig_execute_msg":{"add_member":{"address":"'$SECOND_MEMBER_ADDRESS'", "fee": {"amount": "1000000000000000", "denom": "inj"},"sender":""}}}}'

yarn start --action query --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"query_multisig_by_member": "'$SECOND_MEMBER_ADDRESS'"}'
echo "Above output should contain the example multisig: $EXAMPLE_MULTISIG_CONTRACT"

# {"contract_addr":"xion1cx0p8s0j3y0yckdda8lx2zeqj7lc4ut6hfff63pf2u82pdkg9k2s6724l9","payload":{"multisig_execute_msg":{"propose":{"title":"ICA transaction","description":"some desc :)","msgs":[{"wasm":{"execute":{"contract_addr":"xion1p0urndytwvqljts8tehe0qkc50t43qndd8qj36xpg60prmaht5jslk47fq","msg":"eyJzZW5kX2Nvc21vc19tc2dzIjp7Im1lc3NhZ2VzIjpbeyJzdGFyZ2F0ZSI6eyJ0eXBlX3VybCI6Ii9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmQiLCJ2YWx1ZSI6Ikdnd0tBMmx1YWhJRk1USXpORFU9In19XSwicGFja2V0X21lbW8iOiJDcmVhdGVkIGJ5IENoZWxvIn19","funds":[]}}}],"sender":"xion13adywsndspjvnupycw8nq89pkxfrpx6yp008rqd8wuhtyk9c96lqlnv6jk"}}}}

echo "-----------------------------------------------"
echo "cw3FixedMultisig.codeId: $MULTISIG_CODEID"
echo "icaFactory.address: $MULTISIG_ICA_FACTORY_CONTRACT"
echo "proxyMultisig.address: $PROXY_CONTRACT"
echo "-----------------------------------------------"
echo " - ica_controller: $ICA_CONTROLLER_CODE_ID"
echo " - proxy: $PROXY_CODEID"
echo " - multisig: $MULTISIG_CODEID"
echo " - factory: $MULTISIG_ICA_FACTORY_CODEID"
echo "-----------------------------------------------"
echo " - factory: $MULTISIG_ICA_FACTORY_CONTRACT"
echo " - proxy: $PROXY_CONTRACT"
echo " - example_multisig: $EXAMPLE_MULTISIG_CONTRACT"
echo " - example_ica_controller: $EXAMPLE_ICA_CONTROLLER_CONTRACT"
