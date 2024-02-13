# Xion Hackton -

I'm excited to announce that I'll be publishing the architecture for the project we're planning to build for the Hackathon. Any feedback or suggestions you may have are more than welcome!

The Story: Users often find themselves in a situation where they want to purchase an expensive NFT or perform a significant swap, but they lack the required funds. In response, they open a vault smart contract on Xion that demands multiple signatures. The user deposits tokens into a smart account that will generate ICA on the Injective network, execute the swap/purchase, and then return the assets to the Xion account.

<img width="1265" alt="Screenshot 2024-01-17 at 9 31 19 PM" src="https://github.com/chelofinance/Xion-hackton/assets/81328098/ddd4f835-5605-4760-8c35-ed99d8252d18">

## A more specific view of our contracts and the interactions between them

![xion_hackton drawio](https://github.com/chelofinance/Xion-hackton/assets/99182859/65b8a2aa-2aec-4f32-891f-e3ae3ea70224)

## Contracts Scripts

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

### Xion code ids for each contract

- ica_controller: 59
- multisig: 158
- factory: 159

### Xion addresses

- factory: xion1qmjxqd2j3vgcjrc9ea70qae2rkf28tced4sv50twmuxshzrxyfsq7saj9e

- example multisig: xion1gs82e4l37phcp8hx4lj95tcqt3af4y5vnweypx9l3tklg7n6cr4qmtz0pj

- example ica_controller: xion1zmn7swv9e49sppk3cz0ght5rxw496pc5yhf6y3wq8yp0z6vshrusl5zsrc
