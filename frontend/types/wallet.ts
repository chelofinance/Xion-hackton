
export type WalletType = 'xion';

export type Wallet = Readonly<{
  type: WalletType;
  name: string;
  logoURL: string;
  // getConnector: () => Promise<Connector | null>;
  onNoConnector: () => void;
  isComing?: boolean;
}>;

export type ConnectedWallet = Readonly<
  Omit<Wallet, 'getConnector' | 'onNoConnector'> 
  // & {
  //   account: EthAccount;
  //   connector: Connector;
  // }
>;
