import dotenv from "dotenv";
import {getSigningClient, getStargateClient, loadSignerFromMnemonic} from "./utils/wallet";
import yargs from "yargs";
import config from "./config";
import {actions} from "./actions";
import {Arguments} from "./types";
import {getMessage} from "./utils/args";

dotenv.config();

const main = async () => {
  const args = yargs(process.argv.slice(2)).options({
    network: {type: "string", demandOption: true, alias: "n", desc: "chain to interact with"},
    action: {type: "string", demandOption: true, alias: "a", desc: "action"},

    contract: {type: "string", demandOption: false, alias: "sc", desc: "contract"},
    controller: {type: "string", demandOption: false, alias: "ica", desc: "ica-controller"},
    funds: {
      type: "string",
      demandOption: false,
      alias: "f",
      desc: "funds in native token amount",
    },
    codeId: {type: "number", demandOption: false, desc: "code id of contract"},
    message: {type: "string", demandOption: false, desc: "message to send to contract"},
    label: {type: "string", demandOption: false, desc: "label of contract"},
  }).argv as Arguments;

  if (args.message) args.message = getMessage(args.message as any);

  const network = config.networks[args.network];
  const action = actions[args.action];

  if (!network) throw new Error(`network ${args.network} not in config file`);
  if (!action) throw new Error(`action ${args.action} not implemented`);

  const signer = await loadSignerFromMnemonic(network);
  const client = await getSigningClient(network, signer);
  const stargate = await getStargateClient(network, signer);
  const accounts = await signer.getAccounts();
  const response = await action({
    client,
    signer,
    stargate,
    accounts: accounts.map(({address}) => ({
      address,
    })),
    args,
    network,
    config,
  });

  console.log(response);
};

main();
