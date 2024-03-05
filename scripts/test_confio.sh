set -e

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

NETWORK="archway-testnet";
DENOM="aconst";
ICA_CONTROLLER_CODE_ID=2142;
CONNECTION_ID="connection-81"; # https://docs.archway.io/resources/ibc-channels
COUNTER_PARTY_CONNECTION_ID="connection-1427";
MULTISIG_ICA_FACTORY_CONTRACT="archway1zvc6lv6wv77xenckrgalcfaz2rdg2wqhuvmetpgswjwqql3cm2rqk30k9f"
PROXY_CONTRACT="archway1qwhqja6y23yr242pewwaprwgy54kqm74n4egxwp5jn60t6kkd4kqg0z5px"

MY_WALLET_ADDRESS=$(yarn start --action address --network $NETWORK | grep 'data: ' | awk -F'"' '{print $2}')
if [ -z "$MY_WALLET_ADDRESS" ]; then echo "Failed to get MY_WALLET_ADDRESS"; exit 1; fi
echo "My Wallet Address: $MY_WALLET_ADDRESS"

# # Testing factory
TX_HASH=$(yarn start --action execute --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"deploy_multisig_ica": {"channel_open_init_options":{"connection_id":"'$CONNECTION_ID'","counterparty_connection_id":"'$COUNTER_PARTY_CONNECTION_ID'"},"multisig_instantiate_msg":{"max_voting_period":{"time":36000},"proxy":"'$PROXY_CONTRACT'","threshold":{"absolute_count":{"weight":1}},"voters":[{"addr":"'$MY_WALLET_ADDRESS'","weight":1}]},"salt":"'$(date +%s)'"}}' | grep "transaction:" | awk -F"'" '{print $2}')
# TX_HASH="7E1AAC09F66F638EFA1E8C40FACC34F8A45D32AC864F3C278D4262BAFA6E3DF3"
echo "Transaction: $TX_HASH"

CHANNEL_INIT_OUTPUT=$(yarn start --action events --network $NETWORK --hash $TX_HASH)
# echo $CHANNEL_INIT_OUTPUT > output.txt
# CHANNEL_INIT_OUTPUT=$(cat output.txt)
SRC_CHANNEL_ID=$(echo $CHANNEL_INIT_OUTPUT | awk -F'"channel_id"' '{print $2}'|awk -F'"' '{print $4}')
# SRC_CHANNEL_ID="channel-96"
echo "SRC_CHANNEL_ID: $SRC_CHANNEL_ID"

EXAMPLE_ICA_CONTROLLER_CONTRACT=$(echo $CHANNEL_INIT_OUTPUT | grep '"value": "wasm\.' | awk -F'"value": "wasm\.' '{print $2}' | awk -F'"' '{print $1}')

if [ -z "$EXAMPLE_ICA_CONTROLLER_CONTRACT" ]; then echo "Failed to get EXAMPLE_ICA_CONTROLLER_CONTRACT"; exit 1; fi
if [[ $EXAMPLE_ICA_CONTROLLER_CONTRACT == *"\n"* ]]; then echo "EXAMPLE_ICA_CONTROLLER_CONTRACT has new line"; exit 1; fi
echo "Example ICA Controller Contract: $EXAMPLE_ICA_CONTROLLER_CONTRACT"

yarn start --action confio --network archway-testnet --network2 osmosis-testnet --connection-id $CONNECTION_ID --connection-id2 $COUNTER_PARTY_CONNECTION_ID --controller $EXAMPLE_ICA_CONTROLLER_CONTRACT --src-channel-id $SRC_CHANNEL_ID

yarn start --action query --contract $EXAMPLE_ICA_CONTROLLER_CONTRACT --network archway-testnet --message '{"get_contract_state": {}}'
