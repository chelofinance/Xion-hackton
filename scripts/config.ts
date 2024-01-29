import {Config} from "./types";

const config: Config = {
  networks: {
    "xion-testnet": {
      chainId: "xion-testnet-1",
      node: "https://rpc.xion-testnet-1.burnt.com:443",
      gasPrice: "0.001uxion",
      gasAdjustment: 1.3,
      prefix: "xion",
      denom: "uxion",
    },
  },
};

export default config;
