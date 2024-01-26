import {required} from "../utils/args";
import {Action} from "../types";

const execute: Action = async (action) => {
  const {args, client, accounts} = action;

  required(args, "contract");
  required(args, "message");
  required(args, "network");

  const {transactionHash, height} = await client.execute(
    accounts[0].address,
    args.contract as string,
    args.message as object,
    "auto",
    ""
  );

  return {
    transaction: transactionHash,
    height,
  };
};

export default execute;
