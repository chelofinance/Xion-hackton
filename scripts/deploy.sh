set -e

cd ../contracts/proxy
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
PROXY_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/proxy.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$PROXY_CODEID" ]; then echo "Failed to get PROXY_CODEID"; exit 1; fi
echo "Proxy CodeID: $PROXY_CODEID"
PROXY_CONTRACT=$(yarn start --action instantiate --code-id $PROXY_CODEID --message '{}' --network xion-testnet| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
echo "Proxy Contract: $PROXY_CONTRACT"

cd ../contracts/multisig
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
MULTISIG_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/multisig.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$MULTISIG_CODEID" ]; then echo "Failed to get MULTISIG_CODEID"; exit 1; fi
echo "Multisig CodeID: $MULTISIG_CODEID"

cd ../contracts/multisig-ica-factory
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
MULTISIG_ICA_FACTORY_CODEID=$(yarn start --action store --contract $(pwd)/../target/wasm32-unknown-unknown/release/multisig_ica_factory.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')
if [ -z "$MULTISIG_ICA_FACTORY_CODEID" ]; then echo "Failed to get MULTISIG_ICA_FACTORY_CODEID"; exit 1; fi
echo "Multisig ICA Factory CodeID: $MULTISIG_ICA_FACTORY_CODEID"
MULTISIG_ICA_FACTORY_CONTRACT=$(yarn start --action instantiate --code-id $MULTISIG_ICA_FACTORY_CODEID --message '{"cw3_multisig_code_id": '"$MULTISIG_CODEID"',"cw_ica_controller_code_id": 59, "proxy": "'"$PROXY_CONTRACT"'"}' --network xion-testnet| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
if [ -z "$MULTISIG_ICA_FACTORY_CONTRACT" ]; then echo "Failed to get MULTISIG_ICA_FACTORY_CONTRACT"; exit 1; fi
echo "Multisig ICA Factory Contract: $MULTISIG_ICA_FACTORY_CONTRACT"

# Testing factory
yarn start --action execute --contract $MULTISIG_ICA_FACTORY_CONTRACT --network xion-testnet --message '{"deploy_multisig_ica": {"channel_open_init_options":{"connection_id":"connection-45","counterparty_connection_id":"connection-213"},"multisig_instantiate_msg":{"max_voting_period":{"time":36000},"proxy":"'"$PROXY_CONTRACT"'","threshold":{"absolute_count":{"weight":1}},"voters":[{"addr":"xion1wz2k7rrvm472h37swxp90689jzsvyzch3y4cyz","weight":1}]},"salt":"'$(date +%s)'"}}'

echo "cw3FixedMultisig.codeId: $MULTISIG_CODEID"
echo "icaFactory.address: $MULTISIG_ICA_FACTORY_CONTRACT"
echo "proxyMultisig.address: $PROXY_CONTRACT"

echo " - ica_controller: 59"
echo " - proxy: $PROXY_CODEID"
echo " - multisig: $MULTISIG_CODEID"
echo " - factory: $MULTISIG_ICA_FACTORY_CODEID"

echo " - factory: $MULTISIG_ICA_FACTORY_CONTRACT"
echo " - proxy: $PROXY_CONTRACT"
