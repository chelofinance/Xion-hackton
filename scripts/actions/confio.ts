import {IbcClient} from "@confio/relayer";
import {GasPrice, SigningStargateClient, StdFee} from "@cosmjs/stargate";
import {InjectiveDirectEthSecp256k1Wallet, InjectiveStargate} from "@injectivelabs/sdk-ts";
import {MsgConnectionOpenTry} from "cosmjs-types/ibc/core/connection/v1/tx";
import {EncodeObject, OfflineDirectSigner} from "@cosmjs/proto-signing";
import {prepareConnectionHandshake} from "@confio/relayer/build/lib/ibcclient";
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";

import execute from "./execute";
import {required} from "../utils/args";
import {Action} from "../types";
import {Tendermint37Client} from "@cosmjs/tendermint-rpc";

const CHARLIE = "0cdb533b9b0e06b9f3d900f2ddfa9d4b491a74410c6e62c822143332a4a8a5b7";
const CLIENTS = {
  //must be changed if timed out
  xion: "07-tendermint-113",
  injective: "07-tendermint-231",
};

class MyInjClient extends InjectiveStargate.InjectiveSigningStargateClient {
  protected constructor(tmClient: any, signer: any, options: any) {
    super(tmClient, signer, options);
  }

  public static async connectWithSigner(
    endpoint: string,
    signer: any,
    options: any = {}
  ): Promise<any> {
    const tmClient = await Tendermint37Client.connect(endpoint);
    return this.createWithSigner(tmClient, signer, options);
  }

  public static async createWithSigner(
    tmClient: any,
    signer: any,
    options: any = {}
  ): Promise<any> {
    return new MyInjClient(tmClient, signer, options);
  }

  signAndBroadcast(
    signerAddress: string,
    messages: readonly EncodeObject[],
    _: StdFee | "auto" | number,
    memo?: string
  ) {
    const fee = {
      amount: [{denom: "inj", amount: "52000000000000"}], // Adjust based on the actual fee amount you wish to pay
      gas: "200000", // Adjust this value based on your needs and estimations
    };
    console.log("our signAndBroadcast");
    const val = messages[0].value as MsgConnectionOpenTry;
    console.log(
      val.consensusHeight,
      val.clientId,
      val.clientState,
      val.counterparty,
      val.counterpartyVersions,
      val.delayPeriod,
      val.proofHeight
    );
    return super.signAndBroadcast(signerAddress, messages, fee, memo); //default gas bc "auto" ends without gas
  }
}

const wait = (sec: number) => new Promise((res) => setTimeout(res, sec * 1000));

const createClients = async (action: Parameters<Action>[0]) => {
  const {network, signer, accounts, config} = action;
  const injective = config.networks["injective-testnet"];
  const signer2 = (await InjectiveDirectEthSecp256k1Wallet.fromKey(
    Buffer.from(CHARLIE, "hex")
  )) as OfflineDirectSigner;

  const clientA = await IbcClient.connectWithSigner(
    network.node,
    signer as any,
    accounts[0].address,
    {
      gasPrice: GasPrice.fromString(network.gasPrice) as any,
      estimatedBlockTime: 1000,
      estimatedIndexerTime: 1000,
    }
  );
  const clientB = await IbcClient.connectWithSigner(
    injective.node,
    signer2 as any,
    (
      await signer2.getAccounts()
    )[0].address,
    {
      gasPrice: GasPrice.fromString(injective.gasPrice) as any,
      estimatedBlockTime: 1000,
      estimatedIndexerTime: 1000,
    }
  );
  //we need to override the signer since injective is special :)
  const sigClient = await MyInjClient.connectWithSigner(injective.node, signer2, {
    gasPrice: GasPrice.fromString(injective.gasPrice) as any,
  });
  (clientB as any).sign = sigClient;

  return {clientA, clientB, clientIdA: CLIENTS.xion, clientIdB: CLIENTS.injective}; //these are not the clients above
};

const getOpenInitArgs = async (client: SigningCosmWasmClient, tx: string) => {
  const events = (await client.getTx(tx))?.events;
  const ev = events?.find((ev) => ev.type === "channel_open_init");
  const connIdA = ev?.attributes.find((attr) => attr.key === "connection_id");
  console.log(tx);

  return {connIdA: connIdA?.value as string};
};

const confio: Action = async (action) => {
  const {clientA, clientB, clientIdA, clientIdB} = await createClients(action);
  //const {transaction} = (await execute(action)) as {transaction: string}; // create ica_controller

  //const {connIdA} = await getOpenInitArgs(action.client, transaction);
  const {connectionId: connIdA} = await clientA.connOpenInit(clientIdA, clientIdB);
  console.log("connection id:", connIdA);

  await wait(20);
  const proof = await prepareConnectionHandshake(
    clientA,
    clientB,
    clientIdA, //these come from first tx
    clientIdB,
    connIdA
  );
  console.log(
    "connOpenTry",
    proof.consensusHeight?.revisionHeight.toString(),
    proof.consensusHeight?.revisionNumber.toString(),
    proof.proofHeight.revisionHeight.toString(),
    proof.proofHeight.revisionNumber.toString()
  );
  const {connectionId: connIdB} = await clientB.connOpenTry(clientIdB, proof);

  // connectionAck on nodeA
  await wait(20);
  const proofAck = await prepareConnectionHandshake(
    clientB,
    clientA,
    clientIdB,
    clientIdA,
    connIdB
  );
  console.log("connOpenAck");
  await clientA.connOpenAck(connIdA, proofAck);

  // connectionConfirm on dest
  await wait(20);
  const proofConfirm = await prepareConnectionHandshake(
    clientA,
    clientB,
    clientIdA,
    clientIdB,
    connIdA
  );
  console.log("connOpenConfirm");
  await clientB.connOpenConfirm(connIdB, proofConfirm);

  //return JSON.stringify(channel, null, 1);
};

export default confio;
