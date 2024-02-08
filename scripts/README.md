# Contracts Scripts

We built a set of scripts to ease the process of deploying smart contracts to multiple cosmos chains.

_Reasons_: this was done because to deploy a contract A to chain B and C, we needed to download the go client from both chains. This was an aweful development experience, so we created JS scripts to handle contract store, deployment and interaction.

You can start using these scripts by typing yarn start --help on the scripts folder. Follow these steps:

First install the packages:

```shell
yarn
```

Then you must create a .env with your private mnemonic from your wallet. Check the .env.example.

```shell
yarn start --action store --contract <path/to/wasm/file> --network <chain_name>
```

```shell
yarn start --action instantiate --code-id <code_id> --message <init_message_json> --network <chain_name>
```

```shell
yarn start --action execute --contract <contract_address> --message <message> --network <chain_name>
```

Counter example:

```shell
yarn start --action execute --contract xion1x3sxr4wmug78yha27p6wpftt848x4nf6nhg2hfjvk89u2v8qr4hqyxc8ud --message '{"increment": {}}' --network xion-testnet

yarn start --action query --contract xion1x3sxr4wmug78yha27p6wpftt848x4nf6nhg2hfjvk89u2v8qr4hqyxc8ud --message '{"get_count":{}}' --network xion-testnet
```
