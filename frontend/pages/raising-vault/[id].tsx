import type { NextPage } from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import { formatNumber, formatUSD } from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import { CHAIN_METADATA_DICT, TokenSymbols } from '@/constants/app';
import Button, { ButtonProps } from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import { useCallback, useMemo, useRef, useState } from 'react';
import CaptionAmount from '@/components/CaptionAmount';
import ChainLabel from '@/components/ChainLabel';
import AmountInput from '@/components/form-presets/AmountInput';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import useRaisingNFTVault from '@/hooks/useRaisingNFTVault';
import { useParams } from 'next/navigation';
import useMyNFTVaults from '@/hooks/useMyNFTVaults';
import { MyNFTVault } from '@/types/asset';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';
import NumberText from '@/components/NumberText';

const RaisingVault: NextPage = () => {
  const params = useParams<{ id: string }>();

  const vault = useRaisingNFTVault(params.id);

  const [isDepositFormOpen, setIsDepositFormOpen] = useState<boolean>(false);

  const onClickParticipate = useCallback(() => {
    setIsDepositFormOpen(!isDepositFormOpen);
  }, [isDepositFormOpen]);

  const onClickCancelDeposit = useCallback(() => setIsDepositFormOpen(false), []);

  const form = useRef<HTMLFormElement>(null);

  const { getOraclePrice } = useOraclePrice();
  const oraclePrice = getOraclePrice(vault.fixedPrice.symbol);

  const maxDepositAmount = vault.fixedPrice.value - vault.raisedAmount;
  const maxDepositAmountUSD = useMemo(() => new BigNumber(maxDepositAmount).times(oraclePrice), [maxDepositAmount, oraclePrice]);
  const minDepositAmount = 0.000001;

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

  const priceUSD = useMemo(() => new BigNumber(vault.fixedPrice.value).times(oraclePrice), [oraclePrice]);
  const raisedAmountUSD = useMemo(() => new BigNumber(vault.raisedAmount).times(oraclePrice), [oraclePrice]);

  const formattedCompactPriceUSD = priceUSD.gte(1000) ? ` (${formatUSD(priceUSD, { compact: true, semiequate: true })})` : '';
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
      const url = `${CHAIN_METADATA_DICT[vault.chain].explorerAddressURL}/contract/${collectionAddress}`;
      window.open(url, '_blank');
    },
    [vault.chain]
  );

  const [userWallet] = useAtom(userWalletAtom);

  const { raisingVaults: myRaisingVaults } = useMyNFTVaults(userWallet?.account.address);

  const myVault = useMemo<MyNFTVault | undefined>(
    () => myRaisingVaults.find((myVault) => myVault.tokenId === vault.tokenId),
    [myRaisingVaults, vault.tokenId]
  );

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Raising Vault</Heading>

      <section className="space-y-4 mt-20">
        <div className="flex items-stretch gap-x-14">
          <div className="grow-0 shrink-0 w-fit flex flex-col gap-y-4">
            <NFTTumbnail size="xl" imgSrc={vault.imgSrc} />

            <div className="flex items-center gap-x-2">
              <Button
                type="outline"
                size="xs"
                iconType="external_link"
                label={`See in chain explorer`}
                onClick={() => openExplorer(vault.collection.contractAddress)}
              />
              {/* <Button 
                type="outline" 
                size="xs"
                iconType="external_link" 
                label={`See vault details`} 
                onClick={() => openExplorer(vault.ica.icaMultisigAddress)}
              /> */}
            </div>

            {!!myVault && (
              <Card color="primary" className="p-4 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                  <div className="h-6 flex flex-col justify-center Font_label_14px">My deposit</div>
                  <NumberText color="on_primary" formattedNumber={formatUSD(myVault.shareUSD)} />
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
              <Heading tagName="h3">{vault.nftName}</Heading>
              <ChainLabel chain={vault.chain} />
            </div>

            <Card color="glass" className="flex flex-col items-stretch gap-y-2 p-4 text-body">
              <div className="flex items-stretch justify-between gap-x-2 text-body">
                <span className="h-6 flex flex-col justify-center Font_label_14px">Participants</span>

                <span className="flex items-baseline gap-x-1 Font_data_16px_num">
                  {formatNumber(vault.participants)}
                  <span className="Font_caption_xs">joining</span>
                </span>
              </div>

              <div className="flex flex-col items-end gap-y-4">
                <ProgressBar
                  currentNumber={raisedAmountUSD.toNumber()}
                  targetNumber={priceUSD.toNumber()}
                  formatOptions={{ currencySymbol: '$' }}
                  currentNumberCaption={`raised`}
                />
              </div>
            </Card>

            <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
              {/* <div className="flex items-stretch justify-between gap-x-4 text-body"> */}
              <div className="h-6 flex flex-col justify-center Font_label_14px">Fixed price</div>

              <div className="flex flex-col gap-y-2 items-end">
                <CoinAmount size="md" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(vault.fixedPrice.value)} />
                <CaptionAmount size="sm" formattedAmount={formattedPriceUSD} />
              </div>
              {/* </div> */}
            </Card>

            <Card color="primary" className="flex items-stretch justify-between gap-x-4 p-4">
              <div className="h-6 flex flex-col justify-center Font_label_14px">Deposit up to</div>

              <div className="flex flex-col gap-y-2 items-end">
                <CoinAmount
                  size="xl"
                  color="on_primary"
                  symbol={TokenSymbols.INJ}
                  formattedAmount={formatNumber(maxDepositAmount)}
                />
                <div className="flex items-center justify-between">
                  <span className="Font_caption_md_num text-ground">{formatUSD(maxDepositAmountUSD)}</span>
                </div>
              </div>
            </Card>

            {!isDepositFormOpen && (
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
