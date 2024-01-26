import {execute} from "./execute";
import {required} from "../utils/args";
import {Action} from "../types";

const MULTISIG = "xion14l762397rzme5xsgmdvs5d43zaaeux7nxjs0nptc5463jyzv75aq2furgn";

const create_ica: Action = async (action) => {
  const {args, client, accounts} = action;

  required(args, "contract");
  required(args, "network");

  const createICA = {
    owner: args.contract,
    channel_open_init_options: {
      connection_id: "",
      counterparty_connection_id: "",
      counterparty_port_id: "",
      //tx_encoding: Option<TxEncoding>,
    },
    send_callbacks_to: args.contract,
  };
  const proposeCreateICA = {
    propose: {
      title: "create ICA account",
      description: "",
      msgs: {
        wasm: {
          instantiate: {
            admin: args.contract,
            code_id: 59, //ica controller on xion
            msg: Buffer.from(JSON.stringify(createICA)).toString("base64"),
            funds: [],
            label: "ica_controller",
          },
        },
      },
    },
  };

  const {transaction, height} = await execute({...action, message: proposeCreateICA});

  return {
    transaction,
    height,
  };
};

export default create_ica;
