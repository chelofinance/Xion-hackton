import execute from "./execute";
import {Action} from "../types";
import {IndexedTx, CosmWasmClient} from "@cosmjs/cosmwasm-stargate";

//const MULTISIG = "xion14j3nqj4glkfl8lzvc422x03yvwwc9k82jkuwjzys6mdzysw7zpjq6aenzr";

const produceProposal = (args: Parameters<Action>[0]["args"]) => {
  const msg = args.message as {contract_addr: string; msg: object; funds: any[]};

  const controllerMessage = {
    send_cosmos_msgs: {
      messages: [
        {
          wasm: {
            execute: {
              contract_ddr: msg.contract_addr,
              msg: Buffer.from(JSON.stringify(msg.msg)).toString("base64"),
              funds: msg.funds,
            },
          },
        },
      ],
      packet_memo: "wasm by 0xR360",
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
            contract_addr: "xion1sc37w8thh9szjl74y8cje59z0amh6wra7lpmfs30lel9r2wrpa9spfcy90",
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

const propose_ica_wasm: Action = async (action) => {
  const {args, client} = action;
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

export default propose_ica_wasm;
