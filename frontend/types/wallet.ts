import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

export type WalletType = 'abstraxion';

export type Wallet = Readonly<{
  type: WalletType;
  name: string;
  logoURL: string;
  // getConnector: () => Promise<Connector | null>;
  onNoConnector?: () => void;
  isComing?: boolean;
}>;

export type AbstraxionAccount = ReturnType<typeof useAbstraxionAccount>['data'];

export type ConnectedWallet = Readonly<
  Omit<Wallet, 'onNoConnector'> 
  & {
    account: AbstraxionAccount;
  }
>;
