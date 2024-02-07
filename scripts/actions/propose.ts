import execute from "./execute";
import {Action} from "../types";
import {EncodeObject, GeneratedType, Registry} from "@cosmjs/proto-signing";
import {InjectiveWasmxV1Beta1Tx} from "@injectivelabs/core-proto-ts";
import {defaultRegistryTypes as stargateTypes} from "@cosmjs/stargate";
import {wasmTypes, IndexedTx, CosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {required} from "../utils/args";

//const MULTISIG = "xion1l9cd87pqvdjmspmktszx6f54kr7ezed5jp0y8uj2z7m6s459zaksukkszd";
const INJECTIVE_CONTRACT_MSG_URI = "/injective.wasmx.v1.MsgExecuteContractCompat";
const executeType = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat as GeneratedType;
const registry = new Registry([
  [INJECTIVE_CONTRACT_MSG_URI, executeType],
  ...stargateTypes,
  ...wasmTypes,
]);

const buildInjectiveContractMsg = ({value}: EncodeObject) => {
  const message = value.msg;
  return {
    typeUrl: INJECTIVE_CONTRACT_MSG_URI,
    value: {
      sender: value.sender,
      contract: value.contract,
      msg: Buffer.from(JSON.stringify(message)).toString("base64"),
      funds: value.funds,
    },
  };
};

const produceProposal = (args: Parameters<Action>[0]["args"]) => {
  const msg = args.message as EncodeObject;
  const encodedMsg =
    msg.typeUrl === INJECTIVE_CONTRACT_MSG_URI
      ? registry.encode(buildInjectiveContractMsg(msg))
      : registry.encode(msg);
  const controllerMessage = {
    send_cosmos_msgs: {
      messages: [
        {
          stargate: {
            type_url: msg.typeUrl,
            value: Buffer.from(encodedMsg).toString("base64"),
          },
        },
      ],
      packet_memo: "packet meme by 0xR360",
    },
  };
  console.log(
    controllerMessage.send_cosmos_msgs.messages,
    controllerMessage.send_cosmos_msgs.messages[0].stargate.value
  );

  return {
    title: "ICA transaction",
    description: "some desc :)",
    msgs: [
      {
        wasm: {
          execute: {
            contract_addr: args.controller as string,
            msg: Buffer.from(JSON.stringify(controllerMessage)).toString("base64"),
            funds: [],
          },
        },
      },
    ],
  };
};

const getProposalId = async (client: CosmWasmClient, txHash: string) => {
  const tx = await client.getTx(txHash);
  const proposalEv = tx?.events.find((ev) => ev.type === "wasm") as IndexedTx["events"][0];
  const proposal_id = proposalEv?.attributes.find((attr) => attr.key === "proposal_id")
    ?.value as string;

  return proposal_id;
};

const propose: Action = async (action) => {
  const {args, client} = action;

  required(args, "contract");
  required(args, "controller");
  required(args, "message");
  required(args, "network");


  const txList = [] as {transaction: string; height: number}[];
  const buildArgs = (msg: any) => ({...args, message: msg});
  const buildTxs = (action: any) => txList.push(action);

  buildTxs(
    await execute({
      ...action,
      args: buildArgs({
        propose: produceProposal(args),
      }),
    })
  );

  const proposal_id = Number(await getProposalId(client, txList[0].transaction));

  buildTxs(
    await execute({
      ...action,
      args: buildArgs({
        execute: {
          proposal_id,
        },
      }),
    })
  );

  return {
    transactions: txList,
  };
};

export default propose;
