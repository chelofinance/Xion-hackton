import {Config} from "./types";

const config: Config = {
  networks: {
    "injective-mainnet": {
      chainId: "injective-1",
      node: "https://sentry.tm.injective.network:443",
      gasPrice: "0.001inj",
      gasAdjustment: 1.3,
      prefix: "inj",
      denom: "inj",
    },
    "injective-testnet": {
      chainId: "injective-888",
      node: "https://testnet.sentry.tm.injective.network:443",
      gasPrice: "700000000inj",
      gasAdjustment: 2,
      prefix: "inj",
      denom: "inj",
    },
    "xion-testnet": {
      chainId: "xion-testnet-1",
      node: "https://rpc.testcosmos.directory/xiontestnet",
      gasPrice: "0.0uxion",
      gasAdjustment: 1.3,
      prefix: "xion",
      denom: "uxion",
    },
  },
};

export default config;
