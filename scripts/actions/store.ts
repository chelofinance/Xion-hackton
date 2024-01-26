import {Action} from "../types";
import {required} from "../utils/args";
import {getContract} from "../utils/contract";

const store: Action = async (action) => {
  const {args, client, accounts} = action;

  required(args, "contract");
  required(args, "network");

  const contract = getContract(args.contract as string) as Uint8Array;
  const {transactionHash, codeId, height} = await client.upload(
    accounts[0].address,
    contract,
    "auto"
  );

  return {
    transaction: transactionHash,
    codeid: codeId,
    height,
  };
};

export default store;
