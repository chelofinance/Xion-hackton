import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {OfflineSigner} from "@cosmjs/proto-signing";
import {SigningStargateClient} from "@cosmjs/stargate";

export type NetworkConfig = {
  chainId: string;
  node: string;
  prefix: string;
  gasPrice: string;
  gasAdjustment: number;
  denom?: string;
};

export type Config = {
  networks: Record<string, NetworkConfig>;
};

export type Account = {
  address: string;
};

export type Arguments = {
  network: string;
  action: string;

  contract?: string;
  codeId?: number;
  message?: object;
  label?: string;
};

export type Action = (args: {
  args: Arguments;
  network: NetworkConfig;
  config: Config;
  signer: OfflineSigner;
  client: SigningCosmWasmClient;
  stargate: SigningStargateClient;
  accounts: Account[];
}) => unknown;
