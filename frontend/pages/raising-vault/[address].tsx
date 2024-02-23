import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import {AppChains, chainConfigMap, CHAIN_METADATA_DICT, INJECTIVE_ID, TokenSymbols, COIN_DICT, TEST_VAULT} from '@/constants/app';
import Button, {ButtonProps} from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CaptionAmount from '@/components/CaptionAmount';
import ChainLabel from '@/components/ChainLabel';
import AmountInput from '@/components/form-presets/AmountInput';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import useRaisingNFTVault from '@/hooks/useRaisingNFTVaults';
import useMyNFTVaults from '@/hooks/useMyNFTVaults';
import {MyNFTVault, NFT, RaisingNFT} from '@/types/asset';
import {useAtom} from 'jotai';
import {userWalletAtom} from '@/store/states';
import NumberText from '@/components/NumberText';
import {injectiveClient, transferInjective} from '@/utils/injective';
import {useRouter} from 'next/router';
import PageLoader from '@/components/PageLoader';
import Tag from '@/components/Tag';
import {createIcaBuyMsg} from '@/utils/ica';
import {createProposal, executeProposal} from '@/utils/multisig';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {InjectiveSigningStargateClient} from '@injectivelabs/sdk-ts/dist/cjs/core/stargate';
import useMyVaults from '@/hooks/useMyVaults';

const CONFIG = chainConfigMap[AppChains.XION_TESTNET];

const createKeplrSigner = async () => {
  (window as any).keplr.defaultOptions = {
    sign: {preferNoSetFee: true},
  };
  const offlineSigner: any = await (window as any).keplr.getOfflineSignerAuto(INJECTIVE_ID);

  return offlineSigner;
};

const RaisingVault: NextPage = () => {
  const router = useRouter();
  const {address} = router.query;

  const nftList = useRaisingNFTVault();
  const nft = nftList.find((nft) => nft.tokenId === address);
  const [tmpRaisedAmount, setTmpRaisedAmount] = useState<number>(nft?.raisedAmount ?? 0);

  const [isDepositFormOpen, setIsDepositFormOpen] = useState<boolean>(false);

  const onClickParticipate = useCallback(() => {
    setIsDepositFormOpen(!isDepositFormOpen);
  }, [isDepositFormOpen]);

  const onClickCancelDeposit = useCallback(() => setIsDepositFormOpen(false), []);

  const form = useRef<HTMLFormElement>(null);

  const {getOraclePrice} = useOraclePrice();
  const oraclePrice = nft ? getOraclePrice(nft.fixedPrice.symbol) : 0;

  const maxDepositAmount = nft ? Number(nft.fixedPrice.value) - tmpRaisedAmount : 0;
  const maxDepositAmountUSD = useMemo(
    () => new BigNumber(maxDepositAmount.toString()).times(oraclePrice),
    [maxDepositAmount, oraclePrice]
  );
  const minDepositAmount = 0.000000000000000001;

  const [depositAmount, setDepositAmount] = useState<number>(maxDepositAmount);
  const [isDepositAmountValid, setIsDepositAmountValid] = useState<boolean>(true);

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

  const priceUSD = useMemo(() => new BigNumber(nft?.fixedPrice.value.toString() ?? 0).times(oraclePrice), [oraclePrice]);
  const raisedAmountUSD = useMemo(() => new BigNumber(tmpRaisedAmount).times(oraclePrice), [oraclePrice, tmpRaisedAmount]);

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

  const [userWallet] = useAtom(userWalletAtom);

  const { myVaults } = useMyVaults(userWallet?.account.address);

  const {myNFT, myVault} = useMemo<{
    myNFT: RaisingNFT | undefined;
    myVault: MyNFTVault | undefined;
  }>(() => {
    const myVault = myVaults.find((myVault) => myVault.nfts.find((nft) => nft.tokenId === nft?.tokenId));
    const myNFT = myVault?.nfts.find((nft) => nft.tokenId === nft?.tokenId);

    return {
      myNFT,
      myVault,
    };
  }, [myVaults, nft?.tokenId]);

  const myNFTPriceUSD = useMemo<BigNumber>(() => {
    if (!myNFT) return new BigNumber(0);
    const oraclePrice = getOraclePrice(myNFT.fixedPrice.symbol);
    const priceUSD = new BigNumber(myNFT.fixedPrice.value.toString()).times(oraclePrice);
    return priceUSD;
  }, [myNFT]);

  const isRaisedAll = useMemo<boolean>(() => maxDepositAmount === 0, [maxDepositAmount]);
  const isOwningVault = useMemo<boolean>(() => nft?.ownerAddress === myVault?.ica.icaMultisigAddress, [nft, myVault]);

  const handleDeposit = async () => {
    try {
      const keplrSigner = await createKeplrSigner();
      const {client} = await injectiveClient(keplrSigner);
      const accounts = await keplrSigner.getAccounts();
      const addr = accounts[0].address;

      await transferInjective({
        client: client,
        amount: new BigNumber(depositAmount).shiftedBy(18).toString(),
        recipient: TEST_VAULT.icaAccount.address,
        account: addr,
      });

      setTmpRaisedAmount(tmpRaisedAmount + depositAmount);
    } catch (err) {
      console.log('ERR TRANSFER', err);
    }
  };

  const [{client: cosmosCli, signer}, setCosmos] = useState<{
    client: InjectiveSigningStargateClient | null;
    signer: any;
  }>({
    client: null,
    signer: null,
  });

  const init = async () => {
    try {
      const keplrSigner = await createKeplrSigner();
      const {client} = await injectiveClient(keplrSigner);
      const balance = await client.getBalance(TEST_VAULT.icaAccount.address, 'inj');

      setCosmos({client, signer: keplrSigner});
      // setVaultBalance(balance.amount);
    } catch (err) {
      console.log('ERR SETTING UP', err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const {client} = useAbstraxionSigningClient();
  const {data: account} = useAbstraxionAccount();

  const handleICABuyNft = async () => {
    if (!nft) return;

    try {
      const proposal = createIcaBuyMsg({
        ica: TEST_VAULT.icaAccount.address,
        buyContract: nft.buyContractAddress,
        nftContract: nft.collection.contractAddress,
        tokenId: nft.tokenId,
        cost: new BigNumber(nft.fixedPrice.value.toString()).shiftedBy(18).toString(),
      });
      const {proposal_id} = await createProposal({
        client,
        account,
        injectiveMsg: proposal,
        icaMultisigAddress: CONFIG.proxyMultisig.address,
        icaControllerAddress: TEST_VAULT.icaController.address,
      });
      await executeProposal(client, account, CONFIG.proxyMultisig.address, Number(proposal_id));
    } catch (err) {
      console.log('ERR:', err);
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
                  <NumberText color="on_primary" formattedNumber={formatUSD(myNFTPriceUSD.times(myVault.share))} />
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

            <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
              {/* <div className="flex items-stretch justify-between gap-x-4 text-body"> */}
              <div className="h-6 flex flex-col justify-center Font_label_14px">Fixed price</div>

              <div className="flex flex-col gap-y-2 items-end">
                <CoinAmount
                  size="md"
                  symbol={TokenSymbols.INJ}
                  formattedAmount={formatNumber(nft.fixedPrice.value, COIN_DICT[nft.fixedPrice.symbol].decimals)}
                />
                <CaptionAmount size="sm" formattedAmount={formattedPriceUSD} />
              </div>
              {/* </div> */}
            </Card>

            {isRaisedAll && (
              <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
                <div className="h-6 flex flex-col justify-center Font_label_14px">Vault balance</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount size="md" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(tmpRaisedAmount)} />
                  <CaptionAmount size="sm" formattedAmount={formattedPriceUSD} />
                </div>
              </Card>
            )}

            {isRaisedAll && (
              <div className="flex justify-end items-center gap-x-4">
                <Button
                  color="primary"
                  size="lg"
                  label={myNFT ? (isOwningVault ? 'Sell NFT' : 'Buy NFT') : 'Cannot join anymore'}
                  iconType="arrow_forward"
                  className="w-full md:w-fit"
                  status={myNFT ? 'enabled' : 'disabled'}
                  onClick={isOwningVault ? handleICASellNft : handleICABuyNft}
                />
              </div>
            )}

            {!isRaisedAll && (
              <Card color="primary" className="flex items-stretch justify-between gap-x-4 p-4">
                <div className="h-6 flex flex-col justify-center Font_label_14px">Deposit up to</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount
                    size="xl"
                    color="on_primary"
                    symbol={TokenSymbols.INJ}
                    formattedAmount={formatNumber(maxDepositAmount, COIN_DICT[nft.fixedPrice.symbol].decimals)}
                  />
                  <div className="flex items-center justify-between">
                    <span className="Font_caption_md_num text-ground">{formatUSD(maxDepositAmountUSD)}</span>
                  </div>
                </div>
              </Card>
            )}

            {!isRaisedAll && !isDepositFormOpen && (
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
