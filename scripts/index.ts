import dotenv from "dotenv";
import { getSigningClient, getStargateClient, loadSignerFromMnemonic } from "./utils/wallet";
import yargs, { env } from "yargs";
import config from "./config";
import { actions } from "./actions";
import { ActionArgs, Arguments } from "./types";
import { getMessage } from "./utils/args";

dotenv.config();

const main = async () => {
  const args = yargs(process.argv.slice(2)).options({
    network: { type: "string", demandOption: true, alias: "n", desc: "chain to interact with" },
    network2: { type: "string", demandOption: false, alias: "n2", desc: "destination chain to interact with" },
    action: { type: "string", demandOption: true, alias: "a", desc: "action" },

    contract: { type: "string", demandOption: false, alias: "sc", desc: "contract" },
    controller: { type: "string", demandOption: false, alias: "ica", desc: "ica-controller" },
    funds: {
      type: "string",
      demandOption: false,
      alias: "f",
      desc: "funds in native token amount",
    },
    codeId: { type: "number", demandOption: false, desc: "code id of contract" },
    message: { type: "string", demandOption: false, desc: "message to send to contract" },
    label: { type: "string", demandOption: false, desc: "label of contract" },
  }).argv as Arguments;

  if (args.message) args.message = getMessage(args.message as any);

  const network = config.networks[args.network];
  const action = actions[args.action];

  if (!network) throw new Error(`network ${args.network} not in config file`);
  if (!action) throw new Error(`action ${args.action} not implemented`);

  if (!process.env.MNEMONIC) {
    throw new Error("MNEMONIC environment variable is not set. See .env.sample.");
  }

  const signer = await loadSignerFromMnemonic(network, process.env.MNEMONIC);
  const client = await getSigningClient(network, signer);
  const stargate = await getStargateClient(network, signer);
  const accounts = await signer.getAccounts();

  let actionArgs: ActionArgs = {
    client,
    signer,
    stargate,
    accounts: accounts.map(({ address }) => ({
      address,
    })),
    args,
    network,
    config,
  };

  if (args.network2) {
    const network2 = config.networks[args.network2];
    const signer2 = await loadSignerFromMnemonic(network2, process.env.MNEMONIC);
    const client2 = await getSigningClient(network2, signer2);
    const stargate2 = await getStargateClient(network2, signer2);
    const accounts2 = await signer2.getAccounts();

    actionArgs = {
      ...actionArgs,
      network2,
      signer2,
      client2,
      // stargate2,
      accounts2: accounts2.map(({ address }) => ({
        address,
      })),
    };
  }


  const response = await action(actionArgs);

  console.log(response);
};

main();
