import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
import { useMemo } from 'react';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import useMyNFTVaults from '@/hooks/useMyNFTVaults';
import {useAtom} from 'jotai';
import {userWalletAtom} from '@/store/states';
import useBalance from '@/hooks/useBalance';
import NFTVaultLinkCard from '@/components/NFTVaultLinkCard';
import AccountAddress from '@/components/AccountAddress';
import BalanceTotal from '@/components/overlays/AccountOverlay/BalanceTotal';
import AccountButton from '@/components/buttons/AccountButton';
import CopyHelper from '@/components/CopyHelper';
import { shortenAddress } from '@/utils/text';
import Button from '@/components/Button';
import { useRouter } from 'next/router';
import ChainLabel from '@/components/ChainLabel';
import { AllChains } from '@/constants/app';
import Tag from '@/components/Tag';

// const CONFIG = chainConfigMap[AppChains.XION_TESTNET];

// const createKeplrSigner = async () => {
//   (window as any).keplr.defaultOptions = {
//     sign: {preferNoSetFee: true},
//   };
//   const offlineSigner: any = await (window as any).keplr.getOfflineSignerAuto(INJECTIVE_ID);

//   return offlineSigner;
// };

const MyVaults: NextPage = () => {
    const router = useRouter();

    const [userWallet] = useAtom(userWalletAtom);

    const balance = useBalance(userWallet);

    // const formattedBalanceAmount = useMemo(
    //   () => formatNumber(balance.shifted, balance.decimals),
    //   [balance.shifted, balance.decimals]
    // );
  
    const { getOraclePrice } = useOraclePrice();
  
    const myVaults = useMyNFTVaults(userWallet?.account.address);
  
    const myNFTVaultsValueUSD = useMemo(() => {
      return myVaults.reduce((accm, vault) => {
        const nftsValuesUSD = vault.nfts.reduce((accm, nft) => {
            const isOwned = nft.ownerAddress === vault.ica.icaMultisigAddress;
            if (!isOwned) return accm;

            const oraclePrice = getOraclePrice(nft.fixedPrice.symbol);
            const priceUSD = new BigNumber(nft.fixedPrice.value).times(oraclePrice);
            return accm.plus(priceUSD);
        }, new BigNumber(0));
  
        const share = vault.multisig.voters.find((voter) => voter.addr === userWallet?.account.address)?.share ?? 0;
        const shareUSD = nftsValuesUSD.times(share);
  
        return accm.plus(shareUSD);
      }, new BigNumber(0));
    }, [getOraclePrice, myVaults, userWallet?.account.address]);
  
    const formattedTotalUSD = useMemo(() => formatUSD(balance.usd.plus(myNFTVaultsValueUSD)), [balance.usd, myNFTVaultsValueUSD]);
  
    const Content = userWallet === null ? <AccountButton /> : (
        <div className="w-full flex items-stretch gap-x-14 text-body">
          <div className="w-1/3 space-y-14 pb-[5rem]">
            <Card color="glass">
                <div className="space-y-4 p-4">
                    <AccountAddress wallet={userWallet} />
                    <div className="flex items-baseline gap-x-4">
                        <BalanceTotal formattedNumber={formattedTotalUSD} isLoading={false} />
                        <span className="Font_caption_sm">NFTs owned</span>
                    </div>
                </div>
            </Card>
        
            {/* <section className="space-y-2">
                <h4 className="Font_label_14px">Tokens</h4>
                <CoinAmount color="body" size="lg" formattedAmount={formattedBalanceAmount} symbol={balance.symbol} />
            </section> */}
          </div>

          {myVaults[0] && <section className="grow shrink flex flex-col gap-y-6">
                <Heading tagName="h3">Summary</Heading>

                <div className="flex flex-col gap-y-2">
                    <CopyHelper toCopy={myVaults[0].ica.icaMultisigAddress} className="text-body">
                        <div className="flex items-center gap-x-4">
                            <div className="flex items-center">
                                <div className="w-[132px] Font_caption_xs mr-4 text-left">Vault address (ICA)</div>
                                <ChainLabel logoOnly chain={AllChains.INJECTIVE_TESTNET} />
                            </div>

                            <span className="w-fit truncate Font_button_md">{shortenAddress(myVaults[0].ica.icaMultisigAddress, 4, 4)}</span>
                        </div>
                    </CopyHelper>
            
                    <CopyHelper toCopy={myVaults[0].ica.icaControllerAddress} className="text-body">
                        <div className="flex items-center gap-x-4">
                            <div className="flex items-center">
                                <div className="w-[132px] Font_caption_xs mr-4 text-left">Multisig address</div>
                                <ChainLabel logoOnly chain={AllChains.XION_TESTNET} />
                            </div>

                            <span className="w-fit truncate Font_button_md">{shortenAddress(myVaults[0].ica.icaControllerAddress, 4, 4)}</span>
                        </div>
                    </CopyHelper>
                </div>

                <div className="flex flex-col gap-4 items-stretch mt-4">
                {myVaults[0].nfts.map((nft) => (
                    <NFTVaultLinkCard
                        key={nft.tokenId}
                        href="raising-vault"
                        nftVault={nft}
                        amountLabel="Fixed price"
                        formattedAmount={formatNumber(nft.fixedPrice.value)}
                        vaultAddress={myVaults[0].ica.icaMultisigAddress}
                    />
                ))}
                </div>
            </section>}

            {!myVaults[0] && (
                <div className="grow shrink flex flex-col gap-y-4">
                    <Card color="glass" className="p-4 text-body">
                        No vault found.
                    </Card>

                    <div className="flex justify-end">
                    <Button 
                        size="lg"
                        label="Create vault"
                        iconType="arrow_forward"
                        onClick={() => router.push('/create-vault')}
                    />
                    </div>
                </div>
            )}
        </div>
      );
      
  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">My Vaults</Heading>

      <div className="mt-10">
        {Content}
      </div>
    </Main>
  );
};

export default MyVaults;
