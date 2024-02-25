set -e

yarn

NETWORK=xion-testnet

cd ../contracts/proxy
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
PROXY_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/proxy.wasm --network $NETWORK | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$PROXY_CODEID" ]; then echo "Failed to get PROXY_CODEID"; exit 1; fi
echo "Proxy CodeID: $PROXY_CODEID"
PROXY_CONTRACT=$(yarn start --action instantiate --code-id $PROXY_CODEID --message '{}' --network $NETWORK| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
echo "Proxy Contract: $PROXY_CONTRACT"

# Send 1 token through proxy, back to myself
yarn start --action execute --contract $PROXY_CONTRACT --network $NETWORK --message '{ "contract_addr": "xion1wz2k7rrvm472h37swxp90689jzsvyzch3y4cyz", "payload": {"send_token":{"funds": [{"amount": "1", "denom": "uxion"}]}}}' --funds 1

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
MULTISIG_ICA_FACTORY_CONTRACT=$(yarn start --action instantiate --code-id $MULTISIG_ICA_FACTORY_CODEID --message '{"cw3_multisig_code_id": '"$MULTISIG_CODEID"',"cw_ica_controller_code_id": 59, "proxy": "'"$PROXY_CONTRACT"'"}' --network $NETWORK| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
if [ -z "$MULTISIG_ICA_FACTORY_CONTRACT" ]; then echo "Failed to get MULTISIG_ICA_FACTORY_CONTRACT"; exit 1; fi
echo "Multisig ICA Factory Contract: $MULTISIG_ICA_FACTORY_CONTRACT"

# Testing factory
yarn start --action execute --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"deploy_multisig_ica": {"channel_open_init_options":{"connection_id":"connection-43","counterparty_connection_id":"connection-211"},"multisig_instantiate_msg":{"max_voting_period":{"time":36000},"proxy":"'"$PROXY_CONTRACT"'","threshold":{"absolute_count":{"weight":1}},"voters":[{"addr":"xion1wz2k7rrvm472h37swxp90689jzsvyzch3y4cyz","weight":1}]},"salt":"'$(date +%s)'"}}'

QUERY_OUTPUT=$(yarn start --action query --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"query_multisig_by_creator": "xion1wz2k7rrvm472h37swxp90689jzsvyzch3y4cyz"}')
echo "Query output: $QUERY_OUTPUT"
EXAMPLE_MULTISIG_CONTRACT=$(echo $QUERY_OUTPUT | grep '"multisigs":' | awk -F '[][]' '{split($2,a,","); print a[length(a)]}' | awk '{gsub(/"/,"")}1')
EXAMPLE_ICA_CONTROLLER_CONTRACT=$(echo $QUERY_OUTPUT | grep '"controllers":' | awk -F '[][]' '{split($4,a,","); print a[length(a)]}' | awk '{gsub(/"/,"")}1')
if [ -z "$EXAMPLE_MULTISIG_CONTRACT" ]; then echo "Failed to get EXAMPLE_MULTISIG_CONTRACT"; exit 1; fi
if [ -z "$EXAMPLE_ICA_CONTROLLER_CONTRACT" ]; then echo "Failed to get EXAMPLE_ICA_CONTROLLER_CONTRACT"; exit 1; fi

# Testing multisig through proxy
yarn start --action execute --contract $PROXY_CONTRACT --network $NETWORK --message '{"contract_addr":"'$EXAMPLE_MULTISIG_CONTRACT'","payload":{"multisig_execute_msg":{"add_member":{"address":"xion1flkj5f92jq46l3cwhnkd7eyyg035r7fqxypw66", "fee": {"amount": "1000000000000000", "denom": "inj"},"sender":""}}}}'

yarn start --action query --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"query_multisig_by_member": "xion1flkj5f92jq46l3cwhnkd7eyyg035r7fqxypw66"}'
echo "Above output should contain the example multisig: $EXAMPLE_MULTISIG_CONTRACT"

# {"contract_addr":"xion1cx0p8s0j3y0yckdda8lx2zeqj7lc4ut6hfff63pf2u82pdkg9k2s6724l9","payload":{"multisig_execute_msg":{"propose":{"title":"ICA transaction","description":"some desc :)","msgs":[{"wasm":{"execute":{"contract_addr":"xion1p0urndytwvqljts8tehe0qkc50t43qndd8qj36xpg60prmaht5jslk47fq","msg":"eyJzZW5kX2Nvc21vc19tc2dzIjp7Im1lc3NhZ2VzIjpbeyJzdGFyZ2F0ZSI6eyJ0eXBlX3VybCI6Ii9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmQiLCJ2YWx1ZSI6Ikdnd0tBMmx1YWhJRk1USXpORFU9In19XSwicGFja2V0X21lbW8iOiJDcmVhdGVkIGJ5IENoZWxvIn19","funds":[]}}}],"sender":"xion13adywsndspjvnupycw8nq89pkxfrpx6yp008rqd8wuhtyk9c96lqlnv6jk"}}}}

echo "-----------------------------------------------"
echo "cw3FixedMultisig.codeId: $MULTISIG_CODEID"
echo "icaFactory.address: $MULTISIG_ICA_FACTORY_CONTRACT"
echo "proxyMultisig.address: $PROXY_CONTRACT"
echo "-----------------------------------------------"
echo " - ica_controller: 59"
echo " - proxy: $PROXY_CODEID"
echo " - multisig: $MULTISIG_CODEID"
echo " - factory: $MULTISIG_ICA_FACTORY_CODEID"
echo "-----------------------------------------------"
echo " - factory: $MULTISIG_ICA_FACTORY_CONTRACT"
echo " - proxy: $PROXY_CONTRACT"
echo " - example_multisig: $EXAMPLE_MULTISIG_CONTRACT"
echo " - example_ica_controller: $EXAMPLE_ICA_CONTROLLER_CONTRACT"
