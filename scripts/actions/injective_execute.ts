import {Action} from "../types";
import {Coin} from "@cosmjs/amino";
import {
  createTransaction,
  DEFAULT_STD_FEE,
  MsgExecuteContractCompat,
} from "@injectivelabs/sdk-ts";
import {GeneratedType, Registry} from "@cosmjs/proto-signing";
import {InjectiveWasmxV1Beta1Tx} from "@injectivelabs/core-proto-ts";
import {GasPrice, SigningStargateClient} from "@cosmjs/stargate";
import {MsgBroadcaster} from "@injectivelabs/wallet-ts";

//https://github.com/srdtrk/nft-ica-ui/blob/188768d4c0941964d1b647d7edbbb1bbc8bf1f84/src/services/wallet.ts

const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    ethereumChainId: ETHEREUM_CHAIN_ID,
    // wsRpcUrl: alchemyWsRpcEndpoint,
    rpcUrl: alchemyRpcEndpoint,
  },
});

const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});

const injective_execute: Action = async (action) => {
  const {args, accounts, network, signer} = action;

  const typeTarget = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat as GeneratedType;
  const registry = new Registry([["/injective.wasmx.v1.MsgExecuteContractCompat", typeTarget]]);
  const client = await SigningStargateClient.connectWithSigner(network.node, signer, {
    registry,
    gasPrice: GasPrice.fromString(network.gasPrice),
  });

  //required(args, "contract");
  //required(args, "message");
  //required(args, "network");

  const funds = args.funds ? ({denom: network.denom, amount: args.funds} as Coin) : undefined;
  const message = MsgExecuteContractCompat.fromJSON({
    contractAddress: "inj1l9nh9wv24fktjvclc4zgrgyzees7rwdtx45f54",
    sender: accounts[0].address,
    msg: {
      buy_token: {
        token_id: "0",
        contract_address: "inj18fe9tnv4xqkh4hlugjwaw28ne9c08fvxk907ht",
        class_id: "injective",
      },
    },
    funds,
  });

  const {txRaw, signDoc} = createTransaction({
    pubKey: accounts[0].address,
    chainId: network.chainId,
    fee: DEFAULT_STD_FEE,
    message,
    sequence: baseAccount.sequence,
    accountNumber: baseAccount.accountNumber,
  });

  return {
    //transaction: transactionHash,
    //height,
  };
};

export default injective_execute;
