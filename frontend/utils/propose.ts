import {EncodeObject, GeneratedType, Registry} from '@cosmjs/proto-signing';
import {InjectiveWasmxV1Beta1Tx} from '@injectivelabs/core-proto-ts';
import {defaultRegistryTypes as stargateTypes} from '@cosmjs/stargate';
import {wasmTypes} from '@cosmjs/cosmwasm-stargate';

export const INJECTIVE_CONTRACT_MSG_URI = '/injective.wasmx.v1.MsgExecuteContractCompat';
export const WASM_CONTRACT_MSG_URI = '/cosmwasm.wasm.v1.MsgExecuteContract';
const executeType = InjectiveWasmxV1Beta1Tx.MsgExecuteContractCompat as GeneratedType;

const allTypes: Array<[string, GeneratedType]> = [[INJECTIVE_CONTRACT_MSG_URI, executeType], ...stargateTypes, ...wasmTypes];

export const registry = new Registry(allTypes);

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
      msg: Buffer.from(JSON.stringify(message)),
      funds: value.funds,
    },
  };
};

export const produceProposal = (msg: EncodeObject, icaControllerAddress: string) => {
  let encodedMsg;
  if (msg.typeUrl === INJECTIVE_CONTRACT_MSG_URI) encodedMsg = registry.encode(buildInjectiveContractMsg(msg));
  else if (msg.typeUrl === WASM_CONTRACT_MSG_URI) encodedMsg = registry.encode(buildWasmContractMsg(msg));
  else encodedMsg = registry.encode(msg);

  const controllerMessage = {
    send_cosmos_msgs: {
      messages: [
        {
          stargate: {
            type_url: msg.typeUrl,
            value: Buffer.from(encodedMsg).toString('base64'),
          },
        },
      ],
      packet_memo: 'Created by Chelo',
    },
  };

  return {
    title: 'ICA transaction',
    description: 'NFT buy',
    msgs: [
      {
        wasm: {
          execute: {
            contract_addr: icaControllerAddress,
            msg: Buffer.from(JSON.stringify(controllerMessage)).toString('base64'),
            funds: [],
          },
        },
      },
    ],
    sender: '', // Will be updated later
  };
};
