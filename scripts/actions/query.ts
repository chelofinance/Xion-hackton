import {required} from "../utils/args";
import {Action} from "../types";

const query: Action = async (action) => {
    const {args, client, stargate} = action;

    required(args, "contract");
    required(args, "message");
    required(args, "network");

    const data = JSON.stringify(
        await client.queryContractSmart(args.contract as string, args.message as object)
    );

    return {
        data,
    };
};

export default query;
