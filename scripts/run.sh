set -e

cd ../contracts/proxy
RUSTFLAGS='-C link-arg=-s' cargo wasm
cd -
CODEID=$(yarn start --action store --contract /home/kmchmk/Chelo/Xion-hackton/target/wasm32-unknown-unknown/release/proxy.wasm --network xion-testnet | grep -o "codeid: [0-9]*" | awk '{print $2}')

echo "CodeID: $CODEID"


CONTRACT=$(yarn start --action instantiate --code-id $CODEID --message '{}' --network xion-testnet| grep -o "contract: '.*'" | awk -F"'" '{print $2}')

echo "Contract: $CONTRACT"

yarn start --action execute --contract $CONTRACT --message '{"contract_addr": "xion1x3sxr4wmug78yha27p6wpftt848x4nf6nhg2hfjvk89u2v8qr4hqyxc8ud", "payload": {"increment": {}}}' --network xion-testnet
yarn start --action query --contract xion1x3sxr4wmug78yha27p6wpftt848x4nf6nhg2hfjvk89u2v8qr4hqyxc8ud --message '{"get_count": {}}' --network xion-testnet