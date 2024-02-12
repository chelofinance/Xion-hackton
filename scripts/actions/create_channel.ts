import execute from "./execute";
import {Action} from "../types";
import {IndexedTx, CosmWasmClient} from "@cosmjs/cosmwasm-stargate";

const produceProposal = (args: Parameters<Action>[0]["args"]) => {
  const controllerMessage = {
    create_channel: {},
  };

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

const create_channel: Action = async (action) => {
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

export default create_channel;
