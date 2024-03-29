import execute from "./execute";
import {Action} from "../types";
import {EncodeObject, GeneratedType, Registry} from "@cosmjs/proto-signing";
import {InjectiveWasmxV1Beta1Tx} from "@injectivelabs/core-proto-ts";
import {defaultRegistryTypes as stargateTypes} from "@cosmjs/stargate";
import {wasmTypes, IndexedTx, CosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {required} from "../utils/args";

//const MULTISIG = "xion14j3nqj4glkfl8lzvc422x03yvwwc9k82jkuwjzys6mdzysw7zpjq6aenzr";
const INJECTIVE_CONTRACT_MSG_URI = "/injective.wasmx.v1.MsgExecuteContractCompat";
const WASM_CONTRACT_MSG_URI = "/cosmwasm.wasm.v1.MsgExecuteContract";
const executeType = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat as GeneratedType;
const allTypes: Array<[string, GeneratedType]> = [
  [INJECTIVE_CONTRACT_MSG_URI, executeType],
  ...stargateTypes,
  ...wasmTypes,
];

const registry = new Registry(allTypes)

const buildInjectiveContractMsg = ({value}: EncodeObject) => {
  const message = value.msg;
  return {
    typeUrl: INJECTIVE_CONTRACT_MSG_URI,
    value: {
      sender: value.sender,
      contract: value.contract,
      msg: JSON.stringify(message),
      funds: value.funds,
    },
  };
};

const buildWasmContractMsg = ({value}: EncodeObject) => {
  const message = value.msg;
  return {
    typeUrl: WASM_CONTRACT_MSG_URI,
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
  let encodedMsg;
  if (msg.typeUrl === INJECTIVE_CONTRACT_MSG_URI)
    encodedMsg = registry.encode(buildInjectiveContractMsg(msg));
  else if (msg.typeUrl === WASM_CONTRACT_MSG_URI)
    encodedMsg = registry.encode(buildWasmContractMsg(msg));
  else encodedMsg = registry.encode(msg);

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

  console.log(JSON.stringify(controllerMessage));
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

const propose_ica: Action = async (action) => {
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

  console.log("EXECUTE");
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

export default propose_ica;
