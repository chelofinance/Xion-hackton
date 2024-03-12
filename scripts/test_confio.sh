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
NETWORK2="osmosis-testnet";
CONNECTION_ID="connection-81"; # https://docs.archway.io/resources/ibc-channels
COUNTER_PARTY_CONNECTION_ID="connection-1427";
SRC_CLIENT_ID="07-tendermint-88";
DST_CLIENT_ID="07-tendermint-1532";
MULTISIG_ICA_FACTORY_CONTRACT="archway1zvc6lv6wv77xenckrgalcfaz2rdg2wqhuvmetpgswjwqql3cm2rqk30k9f"
PROXY_CONTRACT="archway1qwhqja6y23yr242pewwaprwgy54kqm74n4egxwp5jn60t6kkd4kqg0z5px"
MY_WALLET_ADDRESS="archway1wz2k7rrvm472h37swxp90689jzsvyzchxxn7c7"
TX_HASH="68EBEA3B115AF0CE5799CC636A42393452534BF7AA6E0B068D19C86DAE743414"
SRC_CHANNEL_ID="channel-108"
EXAMPLE_ICA_CONTROLLER_CONTRACT="archway1hrj3fpgyrx7wctexzzf9vkh2xrtcstfztq97v7wqwd4zvrc6gt5sffqjr8"

# NETWORK="archway-testnet";
# NETWORK2="osmosis-testnet";
# CONNECTION_ID="connection-113";
# COUNTER_PARTY_CONNECTION_ID="connection-2397";
# SRC_CLIENT_ID="07-tendermint-104";
# DST_CLIENT_ID="07-tendermint-2551";
# MULTISIG_ICA_FACTORY_CONTRACT="archway1zvc6lv6wv77xenckrgalcfaz2rdg2wqhuvmetpgswjwqql3cm2rqk30k9f"
# PROXY_CONTRACT="archway1qwhqja6y23yr242pewwaprwgy54kqm74n4egxwp5jn60t6kkd4kqg0z5px"
# MY_WALLET_ADDRESS="archway1wz2k7rrvm472h37swxp90689jzsvyzchxxn7c7"
# TX_HASH="68EBEA3B115AF0CE5799CC636A42393452534BF7AA6E0B068D19C86DAE743414"
# SRC_CHANNEL_ID="channel-108"
# EXAMPLE_ICA_CONTROLLER_CONTRACT="archway1hrj3fpgyrx7wctexzzf9vkh2xrtcstfztq97v7wqwd4zvrc6gt5sffqjr8"

# CONNECTION_ID="connection-53"
# COUNTER_PARTY_CONNECTION_ID="connection-2398"
# MULTISIG_ICA_FACTORY_CONTRACT="xion13ldnsn3cncls4mal8lryswcn6yp49wfgak0qfpzgzrrwchtsjglq9t6y38"
# PROXY_CONTRACT="xion1wgrx5864vacjkwpfxd6t72x09eh2cxanqed34vuay0eszxplez2sph6kq3"


# MY_WALLET_ADDRESS=$(yarn start --action address --network $NETWORK | grep 'data: ' | awk -F'"' '{print $2}')
if [ -z "$MY_WALLET_ADDRESS" ]; then echo "Failed to get MY_WALLET_ADDRESS"; exit 1; fi
echo "My Wallet Address: $MY_WALLET_ADDRESS"

# # Testing factory
# TX_HASH=$(yarn start --action execute --contract $MULTISIG_ICA_FACTORY_CONTRACT --network $NETWORK --message '{"deploy_multisig_ica": {"channel_open_init_options":{"connection_id":"'$CONNECTION_ID'","counterparty_connection_id":"'$COUNTER_PARTY_CONNECTION_ID'"},"multisig_instantiate_msg":{"max_voting_period":{"time":36000},"proxy":"'$PROXY_CONTRACT'","threshold":{"absolute_count":{"weight":1}},"voters":[{"addr":"'$MY_WALLET_ADDRESS'","weight":1}]},"salt":"'$(date +%s)'"}}' | grep "transaction:" | awk -F"'" '{print $2}')
echo "Transaction: $TX_HASH"

CHANNEL_INIT_OUTPUT=$(yarn start --action events --network $NETWORK --hash $TX_HASH)
# echo $CHANNEL_INIT_OUTPUT > output.txt
# CHANNEL_INIT_OUTPUT=$(cat output.txt)
SRC_CHANNEL_ID=$(echo $CHANNEL_INIT_OUTPUT | awk -F'"channel_id"' '{print $2}'|awk -F'"' '{print $4}')
echo "SRC_CHANNEL_ID: $SRC_CHANNEL_ID"

EXAMPLE_ICA_CONTROLLER_CONTRACT=$(echo $CHANNEL_INIT_OUTPUT | grep '"value": "wasm\.' | awk -F'"value": "wasm\.' '{print $2}' | awk -F'"' '{print $1}')

if [ -z "$EXAMPLE_ICA_CONTROLLER_CONTRACT" ]; then echo "Failed to get EXAMPLE_ICA_CONTROLLER_CONTRACT"; exit 1; fi
if [[ $EXAMPLE_ICA_CONTROLLER_CONTRACT == *"\n"* ]]; then echo "EXAMPLE_ICA_CONTROLLER_CONTRACT has new line"; exit 1; fi
echo "Example ICA Controller Contract: $EXAMPLE_ICA_CONTROLLER_CONTRACT"

yarn start --action confio --network $NETWORK --network2 $NETWORK2 --connection-id $CONNECTION_ID --connection-id2 $COUNTER_PARTY_CONNECTION_ID --controller $EXAMPLE_ICA_CONTROLLER_CONTRACT --src-channel-id $SRC_CHANNEL_ID --src-client-id $SRC_CLIENT_ID --dst-client-id $DST_CLIENT_ID

yarn start --action query --contract $EXAMPLE_ICA_CONTROLLER_CONTRACT --network archway-testnet --message '{"get_contract_state": {}}'
