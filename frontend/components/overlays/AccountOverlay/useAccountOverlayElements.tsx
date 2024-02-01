import AccountAddress from '@/components/AccountAddress';
import type { OverlayProps } from '@/components/types';
import type { ConnectedWallet } from '@/types/wallet';
import { formatUSD } from '@/utils/number';
import { useMemo } from 'react';
import BalanceTotal from './BalanceTotal';
import NFTs from './NFTs';
import Tokens from './Tokens';
import Button from '@/components/Button';

export type AccountOverlayProps = Omit<OverlayProps, 'ariaLabel'> & {
  wallet: ConnectedWallet;
  onWillDisconnect?: () => void;
};

const useAccountOverlayElements = (props: AccountOverlayProps) => {
  const { wallet, onWillDisconnect } = props;

  const formattedTotalUSD = useMemo(() => formatUSD(0), []);

  const Content = (
    <div className="space-y-3 pb-[5rem] overflow-auto scroll-smooth">
      <AccountAddress wallet={wallet} />
      <BalanceTotal formattedNumber={formattedTotalUSD} isLoading={false} />
      <NFTs ownedNFTs={[]} isOwnedNFTsLoading={false} />
      <Tokens balances={[]} isBalanceLoading={false} />
    </div>
  );

  const DisconnectButton = (
    <Button iconType="disconnect" label="Disconnect" type="outline" color="on_primary" size="sm" onClick={onWillDisconnect} />
  );

  return { Content, DisconnectButton };
};

export default useAccountOverlayElements;