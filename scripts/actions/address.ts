import { required } from "../utils/args";
import { Action } from "../types";

const query: Action = async (action) => {
    const { args, signer } = action;

    required(args, "network");

    const accounts = await signer.getAccounts();

    const data = JSON.stringify(accounts.map(({ address }) => address));

    return {
        data,
    };
};

export default query;
