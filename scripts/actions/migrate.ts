import {Action} from "../types";
import {required} from "../utils/args";

const migrate: Action = async (action) => {
  const {args, client, accounts} = action;

  required(args, "contract");
  required(args, "codeId");
  required(args, "network");

  const {transactionHash, height} = await client.migrate(
    accounts[0].address,
    args.contract as string,
    args.codeId as number,
    {},
    "auto"
  );

  return {
    transaction: transactionHash,
    height,
  };
};

export default migrate;
