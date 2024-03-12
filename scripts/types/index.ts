import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

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
  hash?: string;
  funds?: string;
  codeId?: number;
  message?: object;
  label?: string;
  controller?: string;

  network2?: string;
  connectionId?: string;
  connectionId2?: string;
  srcChannelId?: string;
  srcClientId?: string;
  dstClientId?: string;
};

export type ActionArgs = {
  args: Arguments;
  network: NetworkConfig;
  config: Config;
  signer: OfflineSigner;
  client: SigningCosmWasmClient;
  stargate: SigningStargateClient;
  accounts: Account[];

  network2?: NetworkConfig;
  signer2?: OfflineSigner;
  client2?: SigningCosmWasmClient;
  stargate2?: SigningStargateClient;
  accounts2?: Account[];
}

export type Action = (args: ActionArgs) => unknown;
