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

### Make ICA nft buy on Talis

1 - First create a multisig with an ICA controller using our factory

```
./deploy_msig.sh
```

Once you get the result search for the tx result on xion explorer: https://explorer.burnt.com/xion-testnet-1
With it you will get the ica controller address and your multisig address

2 - Get ICA account address. To do this start the relayer and wait for it to relay packets for the creation of a channel and port for your multisig ICA account:

```
hermes start
```

You can also relay the packet manually. For this get the transaction hash of your multisig deployment and search for the following in the logs:

- src port: should be "wasm.<ica_controller_address>"
- src channel: should be under the name channel_id
- dst-connection: you sent it on the factory message as "counterparty_connection_id"
- dst-port: should be "icahost"

After this run the command:

```
hermes tx chan-open-try --dst-chain injective-888 --src-chain xion-testnet-1 --dst-connection <counterparty_connection_id> --dst-port icahost --src-port wasm.<ica_controller_addr> --src-channel <src-channel>
```

3 - Replace ICA account, multisig and ica controller on scritps used for this process.
You can get the ICA by running

```
yarn start --action query --network xion-testnet --message '{"get_contract_state":{}}' --contract <ica_controller>

```

You will replace any script with the flag --controller with the ica controller address you created.
Any tx comming from one of the next scripts must go towards the multisig account.
The ICA account address must be replaced on any field called "sender" or "fromAddress" on the messages [sent](https://github.com/chelofinance/Xion-hackton/blob/main/scripts/messages/ica_buy_nfts.json#L4).

4 - Create proposal and execute it.
To create and execute a proposal to buy an nft you can run:

```
yarn start --action propose_ica --contract <multisig> --network xion-testnet --message ./messages/ica_buy_nfts.json
```

Next step is only needed if you want to relay the packets manually (Sometimes our relayer misses sending packets).

5 - Get the hash of the proposal execution and search for the logs. You will use the logs information to run the following script:

```
hermes tx packet-recv --src-chain xion-testnet-1 --src-port wasm.<ica_controller> --src-channel  <logs.src_channel> --dst-chain injective-888
```

An example of this command can be found on ./relay_packet.sh.

Once the packet is relayed, the NFT should have been bought!!
Sadly the explorer for some reason doesnt shows this transactions (wasm transactions), unless they are native from injective. Still, they can be executed by the contract. Check the new owner of the nft to confirm its execution, if the ICA account is the owner then contragratulations
