import { readFileSync } from "fs";
import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import dotenv from "dotenv";
import { NetworkConfig } from "types";
dotenv.config();

export const loadMnemonic = (path: string) => {
  const mnemonic = readFileSync(path).toString();
  return mnemonic.replace("\n", "");
};

export const loadSignerFromMnemonic = (
  network: NetworkConfig,
  mnemonic: string
): Promise<OfflineSigner> => {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: network.prefix,
  });
};

export const getSigningClient = async (network: NetworkConfig, signer: OfflineSigner) => {
  return await SigningCosmWasmClient.connectWithSigner(network.node, signer, {
    gasPrice: GasPrice.fromString(network.gasPrice),
  });
};

export const getStargateClient = async (network: NetworkConfig, signer: OfflineSigner) => {
  return await SigningStargateClient.connectWithSigner(network.node, signer, {
    gasPrice: GasPrice.fromString(network.gasPrice),
  });
};
