# Xion Hackton -

I'm excited to announce that I'll be publishing the architecture for the project we're planning to build for the Hackathon. Any feedback or suggestions you may have are more than welcome!

**Nomos: Enhancing Cross-Chain Utility with ICA Controllers**

**Pioneering Blockchain Interoperability with ICA Controllers**

Nomos, developed by Chelo Labs, marks a significant stride in blockchain technology, emphasizing the versatility of Interchain Account (ICA) controllers. This project underlines the capacity to execute seamless cross-chain functionalities through smart contracts, bypassing the need for specific network SDKs, thanks to the universal compatibility with any IBC and CosmWasm network.

**Core Focus: ICA Controller Technology**

At the heart of this initiative is the ICA controller, empowering direct and versatile operations across diverse blockchain landscapes. Key benefits include:

- **Universal Cross-Chain Operations**: Enables transactions and interactions across IBC and CosmWasm networks via a unified smart contract approach.
- **Streamlined User Experience**: Offers a simplified, singular interface for managing cross-chain activities, enhancing user engagement and accessibility.
- **Innovative Asset Strategies**: Illustrates the controller's utility in novel scenarios like collective NFT purchases, showcasing the broader implications for asset management and investment.

**Leveraging Account Abstraction and Collective Decision-Making**

- **Unified Management with Account Abstraction**: Integrating with Xion's account abstraction, Nomos vault redefines cross-chain operation management, centralizing control and improving the user experience within an intuitive network framework.
- **Decision-Making Empowerment**: Following NFT acquisition, the Nomos vault grants participants the power to collaboratively determine the asset's fate—be it to hold or sell. This feature accentuates the democratic essence of Nomos's technology, facilitating group strategy and asset disposition.

**Application Case: Collective NFT Acquisition**

The project's application in facilitating a group NFT purchase on the Injective Talis marketplace not only serves to demonstrate the ICA controller's functional prowess but also underscores its potential in enabling communal investment ventures within digital asset realms.


**Conclusion: Advancing Blockchain Interoperability**

Nomos, through the strategic application of ICA controllers, is setting a new paradigm for blockchain interoperability and cross-chain asset management. By facilitating innovative use cases like collective NFT ownership and democratizing decision-making processes, Nomos is not just showcasing technological innovation but is also fostering a more cohesive and accessible blockchain ecosystem for the future.

**Project Considerations:**

Acknowledging the developmental phase of Xion's account abstraction and external hurdles such as Talis's API absence, this project navigates through initial limitations including the need for relayer setup due to indirect IBC connections. These aspects are integral to the project's evolution towards achieving a seamless, integrative user experience.

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
- multisig: 197
- factory: 159

### Xion addresses

- factory: xion1l33tz82g5n6kq6gtceyjhsk0fcqqrytwr5dzglaq5pulq96np4vqm6k8ce

- example multisig: xion1gs82e4l37phcp8hx4lj95tcqt3af4y5vnweypx9l3tklg7n6cr4qmtz0pj

- example ica_controller: xion1zmn7swv9e49sppk3cz0ght5rxw496pc5yhf6y3wq8yp0z6vshrusl5zsrc
