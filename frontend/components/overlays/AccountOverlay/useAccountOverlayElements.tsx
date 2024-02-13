import AccountAddress from '@/components/AccountAddress';
import type { OverlayProps } from '@/components/types';
import type { ConnectedWallet } from '@/types/wallet';
import { formatNumber, formatUSD } from '@/utils/number';
import { useMemo } from 'react';
import BalanceTotal from './BalanceTotal';
import NFTs from './NFTs';
import Button from '@/components/Button';
import useBalance from '@/hooks/useBalance';
import CoinAmount from '@/components/CoinAmount';

export type AccountOverlayProps = Omit<OverlayProps, 'ariaLabel'> & {
  wallet: ConnectedWallet;
  onWillDisconnect?: () => void;
};

const useAccountOverlayElements = (props: AccountOverlayProps) => {
  const { wallet, onWillDisconnect } = props;
  const balance = useBalance(wallet);

  const formattedBalanceAmount = useMemo(() => formatNumber(balance.shifted, balance.decimals), [balance.shifted, balance.decimals]);
  const formattedTotalUSD = useMemo(() => formatUSD(balance.usd), [balance.usd]);

  const Content = (
    <div className="space-y-3 pb-[5rem] overflow-auto scroll-smooth">
      <AccountAddress wallet={wallet} />
      <BalanceTotal formattedNumber={formattedTotalUSD} isLoading={false} />
      <CoinAmount color="caption" size="md" formattedAmount={formattedBalanceAmount} symbol={balance.symbol} />
    </div>
  );

  const DisconnectButton = (
    <Button iconType="disconnect" label="Disconnect" type="outline" color="on_primary" size="sm" onClick={onWillDisconnect} />
  );

  return { Content, DisconnectButton };
};

export default useAccountOverlayElements;
