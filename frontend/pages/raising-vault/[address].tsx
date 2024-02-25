import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import {formatNumber, formatUSD, simpleFormat} from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import {CHAIN_METADATA_DICT, TokenSymbols, COIN_DICT} from '@/constants/app';
import Button, {ButtonProps} from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import {useCallback, useMemo, useRef, useState} from 'react';
import CaptionAmount from '@/components/CaptionAmount';
import ChainLabel from '@/components/ChainLabel';
import AmountInput from '@/components/form-presets/AmountInput';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import useRaisingNFTVault from '@/hooks/useRaisingNFTVaults';
import {MyVault, RaisingNFT} from '@/types/asset';
import {useAtom} from 'jotai';
import {userWalletAtom} from '@/store/states';
import NumberText from '@/components/NumberText';
import {useRouter} from 'next/router';
import PageLoader from '@/components/PageLoader';
import Tag from '@/components/Tag';
import useDepositToVaultMultisig from '@/hooks/useDepositToVaultMultisig';
import useBalanceOnXion from '@/hooks/useBalanceOnXion';
import useBalanceOnInjective from '@/hooks/useBalanceOnInjective';
import CheckItem from '@/components/CheckItem';
import {shortenAddress} from '@/utils/text';
import useICABuy from '@/hooks/useICABuy';
import useMyVaults from '@/hooks/useMyVaults';
import { useAbstraxionSigningClient } from '@burnt-labs/abstraxion';

const coin = COIN_DICT[TokenSymbols.INJ];

const RaisingVault: NextPage = () => {
  const router = useRouter();
  const {address} = router.query;

  const nftList = useRaisingNFTVault();
  const [userWallet] = useAtom(userWalletAtom);

  const { client } = useAbstraxionSigningClient();
  const isClientLoading = !client;

  const {myVaults, updateMyVaults} = useMyVaults(client, userWallet?.account.bech32Address);
  const nft = nftList.find((nft) => `${nft.collection.contractAddress}${nft.tokenId}` === address);
  const {myNFT, myVault} = useMemo<{
    myNFT: RaisingNFT | undefined;
    myVault: MyVault | undefined;
  }>(() => {
    const myVault = myVaults.find((myVault) => myVault.proposals.find((proposal) => proposal.nft.tokenId === nft?.tokenId));
    const myNFT = myVault?.proposals.find((proposal) => proposal.nft.tokenId === nft?.tokenId)?.nft;

    return {
      myNFT,
      myVault,
    };
  }, [myVaults, nft?.tokenId]);

  const {getBalance: getBalanceOnInjective} = useBalanceOnInjective(myVault?.multisigAddress);

  const myVaultBalance = getBalanceOnInjective(TokenSymbols.INJ);
  const isRaisedAll = useMemo<boolean>(
    () => !!nft && myVaultBalance.shifted.gte(nft.fixedPrice.value),
    [nft, myVaultBalance.shifted]
  );

  const {getBalance, updateBalance} = useBalanceOnXion(client, userWallet?.account.bech32Address);

  const [isDepositFormOpen, setIsDepositFormOpen] = useState<boolean>(false);

  const onClickParticipate = useCallback(() => {
    setIsDepositFormOpen(!isDepositFormOpen);
  }, [isDepositFormOpen]);

  const onClickCancelDeposit = useCallback(() => setIsDepositFormOpen(false), []);

  const form = useRef<HTMLFormElement>(null);

  const {getOraclePrice} = useOraclePrice();
  const oraclePrice = nft ? getOraclePrice(nft.fixedPrice.symbol) : 0;

  const maxDepositAmount = useMemo(() => {
    const leftovers = nft?.fixedPrice.value.minus(myVaultBalance.shifted).toNumber() ?? 0;
    return leftovers > 0 ? leftovers : 0;
  }, [nft, myVaultBalance.shifted]);

  const maxDepositAmountUSD = useMemo(() => new BigNumber(maxDepositAmount * oraclePrice), [maxDepositAmount, oraclePrice]);

  const minDepositAmount = 0.000000000000000001;

  const [depositAmount, setDepositAmount] = useState<number>(maxDepositAmount);
  const [isDepositAmountValid, setIsDepositAmountValid] = useState<boolean>(true);
  const {buyNftIca, isProcessing: isProcessingBuy} = useICABuy(client);
  const [isSelectVaultOpen, setIsSelectVaultOpen] = useState<boolean>(false);
  const [selectedVault, setSelectedVault] = useState<MyVault | undefined>(myVaults[0]);

  const fallbackSelectedVault = useMemo(() => selectedVault ?? myVaults[0], [selectedVault, myVaults]);

  const onChange = useCallback((debouncedValue: string, isValid: boolean) => {
    setIsDepositAmountValid(isValid);

    const amount = parseFloat(debouncedValue);
    if (!isNaN(amount)) {
      setDepositAmount(amount);
    }
  }, []);

  const depositButtonProps = useMemo<Pick<ButtonProps, 'status'>>(() => {
    return {
      status: isDepositAmountValid ? 'enabled' : 'disabled',
    };
  }, [isDepositAmountValid]);

  const priceUSD = useMemo(
    () => new BigNumber(nft?.fixedPrice.value.div(10 ** coin.decimals) ?? 0).times(oraclePrice),
    [oraclePrice]
  );
  const raisedAmountUSD = myVaultBalance.usd;

  const formattedCompactPriceUSD = priceUSD.gte(1000) ? ` (${formatUSD(priceUSD, {compact: true, semiequate: true})})` : '';
  const formattedPriceUSD = `${formatUSD(priceUSD)}${formattedCompactPriceUSD}`;

  const getDepositAmountErrorMsg = useCallback(
    (value: string) => {
      if (value === '') return 'Enter amount';

      const inputAmount = parseFloat(value);
      if (isNaN(inputAmount)) return 'Invalid number';
      if (inputAmount < minDepositAmount) return `Minimum amount is ${minDepositAmount}`;
      if (inputAmount > maxDepositAmount) return `Maximum amount is ${maxDepositAmount}`;
      return null;
    },
    [minDepositAmount, maxDepositAmount]
  );

  const openExplorer = useCallback(
    (collectionAddress: string) => {
      if (!nft?.chain) return;

      const url = `${CHAIN_METADATA_DICT[nft.chain].explorerAddressURL}/contract/${collectionAddress}`;
      window.open(url, '_blank');
    },
    [nft?.chain]
  );

  const goToNFTPage = useCallback(() => {
    if (nft) router.push(`/nft/${nft.collection.contractAddress}${nft.tokenId}`);
  }, [nft]);

  const handleBuyNft = useCallback(
    async (nft: RaisingNFT, vault: MyVault) => {
      await buyNftIca(vault, nft);
      await updateMyVaults();
    },
    [buyNftIca, updateMyVaults]
  );

  const myNFTPriceUSD = useMemo<BigNumber>(() => {
    if (!myNFT) return new BigNumber(0);
    const oraclePrice = getOraclePrice(myNFT.fixedPrice.symbol);
    const priceUSD = new BigNumber(myNFT.fixedPrice.value.toString()).times(oraclePrice);
    return priceUSD;
  }, [myNFT]);

  const isOwningVault = useMemo<boolean>(() => nft?.ownerAddress === myVault?.multisigAddress, [nft, myVault]);

  const {depositToVaultMultisig, isProcessing: isDepositToVaultProcessing} = useDepositToVaultMultisig(client);

  const handleDeposit = async () => {
    if (!userWallet) {
      console.log('account not found.');
      return;
    }

    if (!myVault) {
      return;
    }

    try {
      await depositToVaultMultisig(myVault, {
        symbol: TokenSymbols.INJ,
        depositAmount,
        senderAddress: userWallet.account.bech32Address,
      });

      await updateBalance();
    } catch (err) {
      console.log('ERR TRANSFER', err);
      alert('An error occured. Check console for details.');
    }
  };

  const handleICASellNft = async () => {
    if (!nft) return;

    try {
      // sell
    } catch (err) {
      console.log('ERR:', err);
    }
  };

  if (nft === undefined) return <PageLoader />;

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Raising NFT</Heading>

      <section className="space-y-4 mt-20">
        <div className="flex items-stretch gap-x-14">
          <div className="grow-0 shrink-0 w-fit flex flex-col gap-y-4">
            <NFTTumbnail size="xl" imgSrc={nft.imgSrc} />

            <div className="flex items-center gap-x-2">
              <Button
                type="outline"
                size="xs"
                iconType="external_link"
                label={`See in chain explorer`}
                onClick={() => openExplorer(nft.collection.contractAddress)}
              />
              <Button type="outline" size="xs" iconType="external_link" label={`See NFT details`} onClick={goToNFTPage} />
              {/* <Button 
                type="outline" 
                size="xs"
                iconType="external_link" 
                label={`See nft details`} 
                onClick={() => openExplorer(nft.ica.icaMultisigAddress)}
              /> */}
            </div>

            {!!myNFT && !!myVault && (
              <Card color="primary" className="p-4 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                  <div className="h-6 flex flex-col justify-center Font_label_14px">My deposit</div>
                  <NumberText
                    color="on_primary"
                    formattedNumber={formatUSD(Number(simpleFormat(myNFTPriceUSD.times(myVault.share))))}
                  />
                </div>

                <div className="flex items-center justify-between gap-x-4">
                  <div className="h-6 flex flex-col justify-center Font_label_14px">My share</div>
                  <NumberText color="on_primary" formattedNumber={formatNumber(myVault.share * 100)} unit="%" />
                </div>
              </Card>
            )}
          </div>

          <div className="grow shrink space-y-4">
            <div className="flex items-center justify-between gap-x-4">
              <Heading tagName="h3">
                {nft.nftName}
                {isRaisedAll && <Tag label="Voilà! All raised" size="sm" className="ml-2" />}
              </Heading>

              <ChainLabel chain={nft.chain} />
            </div>

            {myVault && (
              <Card color="glass" className="flex flex-col items-stretch gap-y-2 p-4 text-body">
                <div className="flex items-stretch justify-between gap-x-2 text-body">
                  <span className="h-6 flex flex-col justify-center Font_label_14px">Participants</span>

                  <span className="flex items-baseline gap-x-1 Font_data_16px_num">
                    {formatNumber(nft.participants)}
                    <span className="Font_caption_xs">joining</span>
                  </span>
                </div>

                <div className="flex flex-col items-end gap-y-4">
                  <ProgressBar
                    currentNumber={raisedAmountUSD.toNumber()}
                    targetNumber={priceUSD.toNumber()}
                    formatOptions={{currencySymbol: '$'}}
                    currentNumberCaption={`raised`}
                  />
                </div>
              </Card>
            )}

            <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
              <div className="h-6 flex flex-col justify-center Font_label_14px">Fixed price</div>

              <div className="flex flex-col gap-y-2 items-end">
                <CoinAmount
                  size="md"
                  symbol={TokenSymbols.INJ}
                  formattedAmount={simpleFormat(nft.fixedPrice.value, COIN_DICT[nft.fixedPrice.symbol].decimals)}
                />
                <CaptionAmount size="sm" formattedAmount={formattedPriceUSD} />
              </div>
            </Card>

            {!myVault && myVaults.length === 0 && (
              <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
                <div className="Font_body_md">Get a vault to buy NFTs.</div>

                <div className="flex justify-end">
                  <Button iconType="arrow_forward" label="Create vault" onClick={() => router.push('/my-vaults')} />
                </div>
              </Card>
            )}

            {!myVault && myVaults.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button iconType="expand_more" label="Buy NFT" onClick={() => setIsSelectVaultOpen(!isSelectVaultOpen)} />
                </div>

                {isSelectVaultOpen && (
                  <Card color="primary" className="flex flex-col gap-y-4 p-4">
                    <div className="h-6 Font_label_14px">Select vault to make buy proposal.</div>

                    <ul className="flex flex-wrap gap-x-2">
                      {myVaults.map((myVault) => (
                        <li key={myVault.multisigAddress}>
                          <CheckItem
                            label={shortenAddress(myVault.multisigAddress)}
                            checked={fallbackSelectedVault?.multisigAddress === myVault.multisigAddress}
                            onChange={(isChecked) => {
                              if (isChecked) {
                                setSelectedVault(myVault);
                              }
                            }}
                          />
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-end">
                      <Button
                        iconType="arrow_forward"
                        color="on_primary"
                        label={isClientLoading ? 'Loading client' : 'Propose buy'}
                        status={isClientLoading ? 'disabled' : isProcessingBuy ? 'processing' : 'enabled'}
                        onClick={() => {
                          handleBuyNft(nft, fallbackSelectedVault);
                        }}
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}

            {myVault && (
              <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
                <div className="h-6 flex flex-col justify-center Font_label_14px">Vault balance</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount size="md" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(myVaultBalance.shifted)} />
                  <CaptionAmount size="sm" formattedAmount={formattedPriceUSD} />
                </div>
              </Card>
            )}

            {isOwningVault && (
              <div className="flex justify-end items-center gap-x-4">
                <Button
                  color="primary"
                  size="lg"
                  label="Sell"
                  iconType="arrow_forward"
                  className="w-full md:w-fit"
                  onClick={handleICASellNft}
                />
              </div>
            )}

            {myVault && !isRaisedAll && (
              <Card color="primary" className="flex items-stretch justify-between gap-x-4 p-4">
                <div className="h-6 flex flex-col justify-center Font_label_14px">Deposit up to</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount
                    size="xl"
                    color="on_primary"
                    symbol={TokenSymbols.INJ}
                    formattedAmount={simpleFormat(maxDepositAmount, COIN_DICT[nft.fixedPrice.symbol].decimals)}
                  />
                  <div className="flex items-center justify-between">
                    <span className="Font_caption_md_num text-ground">
                      {formatUSD(Number(simpleFormat(maxDepositAmountUSD)))}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {myVault && !isRaisedAll && !isDepositFormOpen && (
              <div className="flex justify-end items-center gap-x-4">
                <Button
                  color="primary"
                  size="lg"
                  label="Participate"
                  iconType="expand_more"
                  className="w-full md:w-fit"
                  onClick={onClickParticipate}
                />
              </div>
            )}

            {isDepositFormOpen && (
              <Card color="secondary" className="p-4">
                <form ref={form} className="flex flex-col items-stretch gap-y-8">
                  <div className="flex items-stretch justify-between gap-x-4">
                    <div className="w-1/3 h-[3.125rem] flex items-center Font_label_14px whitespace-nowrap">Deposit amount</div>

                    <AmountInput
                      required
                      form={form.current}
                      label="Deposit amount"
                      placeholder="0.0"
                      initialValue={depositAmount}
                      getErrorMsg={getDepositAmountErrorMsg}
                      onChange={onChange}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-x-2">
                    <Button
                      color="on_secondary"
                      type="text"
                      label="Cancel"
                      className="w-full md:w-fit"
                      onClick={onClickCancelDeposit}
                    />
                    <Button
                      color="on_secondary"
                      label="Deposit"
                      iconType="arrow_forward"
                      className="w-full md:w-fit"
                      status={isDepositToVaultProcessing ? 'processing' : 'enabled'}
                      onClick={handleDeposit}
                      {...depositButtonProps}
                    />
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Main>
  );
};

export default RaisingVault;
