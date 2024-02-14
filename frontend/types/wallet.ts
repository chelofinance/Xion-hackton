import type { Account } from "@cosmjs/stargate";

export type WalletType = 'abstraxion';

export type Wallet = Readonly<{
  type: WalletType;
  name: string;
  logoURL: string;
  // getConnector: () => Promise<Connector | null>;
  onNoConnector?: () => void;
  isComing?: boolean;
}>;

export type ConnectedWallet = Readonly<
  Omit<Wallet, 'onNoConnector'> 
  & {
    account: { address: string };
  }
>;
