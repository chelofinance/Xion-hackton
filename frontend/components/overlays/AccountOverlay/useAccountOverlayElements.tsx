import AccountAddress from '@/components/AccountAddress';
import type { OverlayProps } from '@/components/types';
import type { ConnectedWallet } from '@/types/wallet';
import { formatNumber, formatUSD } from '@/utils/number';
import { useCallback, useMemo } from 'react';
import BalanceTotal from './BalanceTotal';
import Button from '@/components/Button';
import useBalance from '@/hooks/useBalanceOnInjective';
import CoinAmount from '@/components/CoinAmount';
import useMyNFTVaults from '@/hooks/useMyNFTVaults';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import NFTVaultLinkCard from '@/components/NFTVaultLinkCard';
import { Abstraxion } from '@burnt-labs/abstraxion';
import useDisconnect from '@/connection/useDisconnect';

export type AccountOverlayProps = Omit<OverlayProps, 'ariaLabel'> & {
  wallet: ConnectedWallet;
};

const useAccountOverlayElements = (props: AccountOverlayProps) => {
  const { wallet, onClose: onCloseModal } = props;
  // const balance = useBalance(wallet);

  // const formattedBalanceAmount = useMemo(
  //   () => formatNumber(balance.shifted, balance.decimals),
  //   [balance.shifted, balance.decimals]
  // );

  // const { getOraclePrice } = useOraclePrice();

  // const { ownedVaults, raisingVaults } = useMyNFTVaults(wallet.account.bech32Address);

  // const myNFTVaultsValueUSD = useMemo(() => {
  //   return ownedVaults.reduce((accm, vault) => {
  //     const oraclePrice = getOraclePrice(vault.fixedPrice.symbol);
  //     const priceUSD = new BigNumber(vault.fixedPrice.value).times(oraclePrice);

  //     const share = vault.multisig.voters.find((voter) => voter.addr === wallet.account.bech32Address)?.share ?? 0;
  //     const shareUSD = priceUSD.times(share);

  //     return accm.plus(shareUSD);
  //   }, new BigNumber(0));
  // }, [getOraclePrice, ownedVaults]);

  // const formattedTotalUSD = useMemo(() => formatUSD(balance.usd.plus(myNFTVaultsValueUSD)), [balance.usd, myNFTVaultsValueUSD]);

  // const Content = (
  //   <div className="space-y-8 pb-[5rem] text-ground">
  //     <section className="space-y-4">
  //       <AccountAddress wallet={wallet} />
  //       <BalanceTotal formattedNumber={formattedTotalUSD} isLoading={false} />
  //     </section>

  //     <section className="space-y-4">
  //       <h4 className="Font_label_14px">Raising NFTs</h4>

  //       <div className="flex flex-col gap-4 items-stretch">
  //         {raisingVaults.map((vault) => (
  //           <NFTVaultLinkCard
  //             key={vault.tokenId}
  //             href="raising-vault"
  //             nftVault={vault}
  //             amountLabel="My deposit"
  //             formattedAmount={formatUSD(vault.shareUSD)}
  //           />
  //         ))}
  //       </div>
  //     </section>

  //     <section className="space-y-4">
  //       <h4 className="Font_label_14px">My Vaults</h4>

  //       <div className="flex flex-col gap-4 items-stretch">
  //         {ownedVaults.map((vault) => (
  //           <NFTVaultLinkCard
  //             key={vault.tokenId}
  //             href="my-vault"
  //             nftVault={vault}
  //             amountLabel="My share"
  //             formattedAmount={formatUSD(vault.shareUSD)}
  //           />
  //         ))}
  //       </div>
  //     </section>

  //     <section className="space-y-2">
  //       <h4 className="Font_label_14px">Tokens</h4>
  //       <CoinAmount color="on_primary" size="lg" formattedAmount={formattedBalanceAmount} symbol={balance.symbol} />
  //     </section>
  //   </div>
  // );

  const Content = <></>;

  const { disconnect, onClose } = useDisconnect({ onDisconnect: onCloseModal });

  // const DisconnectButton = (
  //   <>
  //     <Button iconType="disconnect" label="Disconnect" type="outline" color="on_primary" size="sm" onClick={disconnect} />
  //     <Abstraxion onClose={onClose} />
  //   </>
  // );
  const DisconnectButton = (
    <>
    </>
  );

  return { Content, DisconnectButton };
};

export default useAccountOverlayElements;
