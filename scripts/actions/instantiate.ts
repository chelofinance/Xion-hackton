import {required} from "../utils/args";
import {Action} from "../types";

const instantiate: Action = async (action) => {
  const {args, client, accounts} = action;

  required(args, "codeId");
  required(args, "message");
  required(args, "network");

  const {transactionHash, contractAddress, height} = await client.instantiate(
    accounts[0].address,
    args.codeId as number,
    args.message as any,
    args.label || "contract",
    "auto",
    {admin: accounts[0].address}
  );

  return {
    transaction: transactionHash,
    contract: contractAddress,
    height,
  };
};

export default instantiate;
