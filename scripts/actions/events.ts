import { required } from "../utils/args";
import { Action } from "../types";

const events: Action = async (action) => {
  const { args, client, stargate } = action;

  required(args, "hash");
  required(args, "network");

  const data = JSON.stringify((await client.getTx(args.hash || ""))?.events, null, 1);

  return {
    data,
  };
};

export default events;
