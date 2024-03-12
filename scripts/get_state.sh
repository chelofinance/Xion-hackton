CONTROLER_CONTRACT=$1
if [ -z "$CONTROLER_CONTRACT" ]; then
  echo "Please provide the controler contract address"
  exit 1
fi

yarn start --action query --network archway-testnet --message '{"get_contract_state": {}}' --contract $CONTROLER_CONTRACT