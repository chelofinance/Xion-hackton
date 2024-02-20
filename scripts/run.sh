set -e

cd ../contracts/proxy
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
PROXY_CODEID=$(yarn start --action store --contract /home/kmchmk/Chelo/Xion-hackton/target/wasm32-unknown-unknown/release/proxy.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')
echo "Proxy CodeID: $PROXY_CODEID"
PROXY_CONTRACT=$(yarn start --action instantiate --code-id $PROXY_CODEID --message '{}' --network xion-testnet| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
echo "Proxy Contract: $PROXY_CONTRACT"

cd ../contracts/multisig
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
MULTISIG_CODEID=$(yarn start --action store --contract /home/kmchmk/Chelo/Xion-hackton/target/wasm32-unknown-unknown/release/multisig.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')
echo "Multisig CodeID: $MULTISIG_CODEID"

cd ../contracts/multisig-ica-factory
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
MULTISIG_ICA_FACTORY_CODEID=$(yarn start --action store --contract /home/kmchmk/Chelo/Xion-hackton/target/wasm32-unknown-unknown/release/multisig_ica_factory.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')
echo "Multisig ICA Factory CodeID: $MULTISIG_ICA_FACTORY_CODEID"
MULTISIG_ICA_FACTORY_CONTRACT=$(yarn start --action instantiate --code-id $MULTISIG_ICA_FACTORY_CODEID --message '{"cw3_multisig_code_id": '"$MULTISIG_CODEID"',"cw_ica_controller_code_id": 59}' --network xion-testnet| grep -o "contract: '.*'" | awk -F"'" '{print $2}')
echo "Multisig ICA Factory Contract: $MULTISIG_ICA_FACTORY_CONTRACT"