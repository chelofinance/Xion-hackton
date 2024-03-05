import { IbcClient, Link } from "@confio/relayer";
import { GasPrice, StdFee } from "@cosmjs/stargate";
// import { InjectiveStargate } from "@injectivelabs/sdk-ts";
import { MsgConnectionOpenTry } from "cosmjs-types/ibc/core/connection/v1/tx";
import { EncodeObject } from "@cosmjs/proto-signing";
import { ChannelInfo, prepareChannelHandshake, prepareConnectionHandshake } from "@confio/relayer/build/lib/ibcclient";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { Action } from "../types";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { Order } from "cosmjs-types/ibc/core/channel/v1/channel";
import { required } from "../utils/args";

// export const CHARLIE = "0cdb533b9b0e06b9f3d900f2ddfa9d4b491a74410c6e62c822143332a4a8a5b7";
// const CLIENTS = {
//   //must be changed if timed out
//   xion: "07-tendermint-113",
//   injective: "07-tendermint-231",
// };

const clientIdA = "07-tendermint-88";
const clientIdB = "07-tendermint-1532";

// class MyInjClient extends InjectiveStargate.InjectiveSigningStargateClient {
//   protected constructor(tmClient: any, signer: any, options: any) {
//     super(tmClient, signer, options);
//   }

//   public static async connectWithSigner(
//     endpoint: string,
//     signer: any,
//     options: any = {}
//   ): Promise<any> {
//     const tmClient = await Tendermint37Client.connect(endpoint);
//     return this.createWithSigner(tmClient, signer, options);
//   }

//   public static async createWithSigner(
//     tmClient: any,
//     signer: any,
//     options: any = {}
//   ): Promise<any> {
//     return new MyInjClient(tmClient, signer, options);
//   }

//   signAndBroadcast(
//     signerAddress: string,
//     messages: readonly EncodeObject[],
//     _: StdFee | "auto" | number,
//     memo?: string
//   ) {
//     const fee = {
//       amount: [{ denom: "inj", amount: "52000000000000" }], // Adjust based on the actual fee amount you wish to pay
//       gas: "200000", // Adjust this value based on your needs and estimations
//     };
//     console.log("our signAndBroadcast");
//     const val = messages[0].value as MsgConnectionOpenTry;
//     console.log(
//       val.consensusHeight,
//       val.clientId,
//       val.clientState,
//       val.counterparty,
//       val.counterpartyVersions,
//       val.delayPeriod,
//       val.proofHeight
//     );
//     return super.signAndBroadcast(signerAddress, messages, fee, memo); //default gas bc "auto" ends without gas
//   }
// }

const wait = (sec: number) => new Promise((res) => setTimeout(res, sec * 1000));

const createClients = async (action: Parameters<Action>[0]) => {
  const { network, signer, accounts, network2, signer2 } = action;

  if (network2 === undefined) {
    throw new Error("network2 is undefined");
  }
  if (signer2 === undefined) {
    throw new Error("signer2 is undefined");
  }

  const clientA = await IbcClient.connectWithSigner(
    network.node,
    signer,
    accounts[0].address,
    {
      gasPrice: GasPrice.fromString(network.gasPrice) as any,
      estimatedBlockTime: 1000,
      estimatedIndexerTime: 1000,
    }
  );

  const clientB = await IbcClient.connectWithSigner(
    network2.node,
    signer2,
    (
      await signer2.getAccounts()
    )[0].address,
    {
      gasPrice: GasPrice.fromString(network2.gasPrice) as any,
      estimatedBlockTime: 1000,
      estimatedIndexerTime: 1000,
    }
  );

  // if (network2.prefix === "inj") {
  //   //we need to override the signer since injective is special :)
  //   const sigClient = await MyInjClient.connectWithSigner(network2.node, signer2, {
  //     gasPrice: GasPrice.fromString(network2.gasPrice) as any,
  //   });
  //   (clientB as any).sign = sigClient;
  // }
  // }

  return { clientA, clientB };
};

const getOpenInitArgs = async (client: SigningCosmWasmClient, tx: string) => {
  const events = (await client.getTx(tx))?.events;
  const ev = events?.find((ev) => ev.type === "channel_open_init");
  const connIdA = ev?.attributes.find((attr) => attr.key === "connection_id");
  console.log(tx);

  return { connIdA: connIdA?.value as string };
};

const confio: Action = async (action) => {
  const { args } = action;
  const { clientA, clientB } = await createClients(action);

  required(args, "controller");
  required(args, "srcChannelId");

  if (args.connectionId === undefined) {
    throw new Error("missing --connection-id");
  }
  if (args.connectionId2 === undefined) {
    throw new Error("missing --connection-id2");
  }
  if (clientB === undefined) {
    throw new Error("clientB is undefined");
  }

  // const createConnectionResults = await clientA.connOpenInit(clientIdA, clientIdB);
  // const { connectionId: connectionIdA } = createConnectionResults;
  // console.log("connection id A:", connectionIdA);

  // // const connectionIdA = "connection-81";
  // // const connectionIdA = "connection-105";
  // const proofTry = await prepareConnectionHandshake(
  //   clientA,
  //   clientB,
  //   clientIdA,
  //   clientIdB,
  //   connectionIdA
  // );

  // const createConnectionTryResults = await clientB.connOpenTry(clientIdB, proofTry);
  // const { connectionId: connectionIdB } = createConnectionTryResults;
  // console.log("connection id B:", connectionIdB);

  // const connectionIdB = "connection-1427";
  // const connectionIdB = "connection-2369";
  // const proofAck = await prepareConnectionHandshake(
  //   clientB,
  //   clientA,
  //   clientIdB,
  //   clientIdA,
  //   connectionIdB
  // );
  // console.log("connOpenAck");
  // const msgResultsAck = await clientB.connOpenAck(connectionIdB, proofAck);
  // console.log("connOpenAck", msgResultsAck);

  // await wait(1);
  // console.log("connOpenConfirm");
  // const proofConfirm = await prepareConnectionHandshake(
  //   clientA,
  //   clientB,
  //   clientIdA,
  //   clientIdB,
  //   connectionIdA
  // );
  // // const msgResultsConfirm = await clientA.connOpenConfirm(connectionIdA, proofConfirm);
  // const msgResultsConfirm = await clientB.connOpenConfirm(connectionIdB, proofConfirm);
  // console.log("connOpenConfirm", msgResultsConfirm);

  const connectionIdA = args.connectionId; // "connection-81";
  const connectionIdB = args.connectionId2; //"connection-1427";

  const channelIdA = args.srcChannelId || "";

  const portIdA = "wasm." + args.controller
  const portIdB = "icahost"
  // console.log("portIdA:", portIdA)
  const link = await Link.createWithExistingConnections(clientA, clientB, connectionIdA, connectionIdB);
  console.log(
    "link:",
    link
  );

  // const creatChannelResultsInit = await clientA.channelOpenInit(portIdA, portIdB, Order.ORDER_UNORDERED, connectionIdA, "versionA");
  // const { channelId: channelIdA } = creatChannelResultsInit;
  // console.log("channel id A:", channelIdA);

  const channelA = await link.endA.client.query.ibc.channel.channel(
    portIdA,
    channelIdA,
  );
  console.log("channelA:", channelA);

  // const channelB = await link.endB.client.query.ibc.channel.channel(
  //   portIdB
  //   channelIdB,
  // );

  const proofTry = await prepareChannelHandshake(
    clientA,
    clientB,
    clientIdB,
    portIdA,
    channelIdA);

  console.log("channelOpenTry");
  const creatChannelResultsTry = await clientB.channelOpenTry(
    portIdB,
    {
      portId: portIdA,
      channelId: channelIdA,
    },
    Order.ORDER_UNORDERED,
    connectionIdB,
    "versionA",
    "versionB",
    proofTry
  );

  const { channelId: channelIdB } = creatChannelResultsTry;
  console.log("channel id B:", channelIdB);

  // const link = await Link.createWithExistingConnections(clientA, clientB, connectionIdA, connectionIdB);
  // link.rela()
  // const channelPair = await link.createChannel("A", portIdA, portIdB, Order.ORDER_UNORDERED, "versionA");
  // console.log("channelPair:", channelPair);
  // const acks = await link.getPendingAcks("A")
  // console.log("acks:", acks);
  // const relayInfo = await link.relayAll();
  // console.log("relayInfo:", relayInfo);
};

export default confio;
