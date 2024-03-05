import { Config } from "./types";

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
      gasPrice: "500000000inj",
      gasAdjustment: 1.3,
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
    "archway-testnet": {
      chainId: "constantine-3",
      node: "https://rpc.constantine.archway.tech",
      gasPrice: "150000000000aconst",
      gasAdjustment: 1.3,
      prefix: "archway",
      denom: "aconst",
    },
    "osmosis-testnet": {
      chainId: "osmo-test-5",
      node: "https://rpc.osmotest5.osmosis.zone",
      gasPrice: "0.025uosmo",
      gasAdjustment: 1.3,
      prefix: "osmo",
      denom: "uosmo",
    },
    "neutron-testnet": {
      chainId: "pion-1",
      node: "https://rpc-falcron.pion-1.ntrn.tech",
      gasPrice: "0.02untrn",
      gasAdjustment: 1.3,
      prefix: "neutron",
      denom: "untrn",
    },
  },
};

export default config;
