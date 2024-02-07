import {required} from "../utils/args";
import {Action} from "../types";
import {Coin} from "@cosmjs/amino";

const execute: Action = async (action) => {
  const {args, client, accounts, network} = action;
  console.log("EXECUTE", args.message);

  required(args, "contract");
  required(args, "message");
  required(args, "network");

  const funds = args.funds ? ([{denom: network.denom, amount: args.funds}] as Coin[]) : undefined;
  const {transactionHash, height} = await client.execute(
    accounts[0].address,
    args.contract as string,
    args.message as object,
    "auto",
    "",
    funds
  );

  return {
    transaction: transactionHash,
    height,
  };
};

export default execute;
