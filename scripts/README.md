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
yarn start --action store --contract <path/to/wasm/file> --chain <chain_name>
```

```shell
yarn start --action instantiate --code-id <code_id> --message <init_message_json> --chain <chain_name>
```

```shell
yarn start --action execute --contract <contract_address> --message <message> --chain <chain_name>
```

Counter example:

```shell
yarn start --action query --contract neutron1zf2tdlq9pn8jq680rlsgwtsgljt54ctu0ulj8cm4s6r93mdmjuwqpurmf4 --message '{"count":{}}' --chain neutron-testnet
```
