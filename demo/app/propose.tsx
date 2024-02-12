import execute from "./execute";
import { Action } from "../types";
import { EncodeObject, GeneratedType, Registry } from "@cosmjs/proto-signing";
import { InjectiveWasmxV1Beta1Tx } from "@injectivelabs/core-proto-ts";
import { defaultRegistryTypes as stargateTypes } from "@cosmjs/stargate";
import { wasmTypes, IndexedTx, CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { required } from "../utils/args";

export const INJECTIVE_CONTRACT_MSG_URI = "/injective.wasmx.v1.MsgExecuteContractCompat";
const executeType = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat as GeneratedType;


const allTypes: Array<[string, GeneratedType]> = [
  [INJECTIVE_CONTRACT_MSG_URI, executeType],
  ...stargateTypes,
  ...wasmTypes,
];

const registry = new Registry(allTypes)

const buildInjectiveContractMsg = ({ value }: EncodeObject) => {
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

export const produceProposalMsg = (msg: EncodeObject, icaControllerAddress: string) => {
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
            contract_addr: icaControllerAddress,
            msg: Buffer.from(JSON.stringify(controllerMessage)).toString("base64"),
            funds: [],
          },
        },
      },
    ],
  };
};