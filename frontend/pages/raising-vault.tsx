import type { NextPage } from 'next';
import Main from '@/components/Main';
import NFTsTable from '@/components/tables/NFTsTable';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import { formatNumber, formatUSD } from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import { AllChains, TokenSymbols } from '@/constants/app';
import Button, { ButtonProps } from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import TextInput from '@/components/TextInput';
import { useCallback, useMemo, useRef, useState } from 'react';
import CaptionAmount from '@/components/CaptionAmount';
import ChainLabel from '@/components/ChainLabel';
import AmountInput from '@/components/form-presets/AmountInput';

const NFT_DETAIL: {
  id: string;
  nftName: string;
  imgSrc: string;
  description: string;
  chain: AllChains;
  price: number;
  priceUSD: number;
  raisedAmountUSD: number;
  participants: number;
} = {
  id: 'MultiSig 1',
  nftName: 'Monkey - 2004(WOOD)',
  imgSrc: 'https://images.talis.art/tokens/6582d0be4a3988d286be0f9c/mediaThumbnail',
  description: 'We are destined to rule.',
  chain: AllChains.INJECTIVE_TESTNET,
  price: 1313133,
  priceUSD: 23133,
  raisedAmountUSD: 1111000,
  participants: 13133,
};

const RaisingVault: NextPage = () => {
  const [isDepositFormOpen, setIsDepositFormOpen] = useState<boolean>(false);

  const onClickParticipate = useCallback(() => {
    setIsDepositFormOpen(!isDepositFormOpen);
  }, [isDepositFormOpen]);

  const onClickCancelDeposit = useCallback(() => setIsDepositFormOpen(false), []);

  const form = useRef<HTMLFormElement>(null);

  const maxDepositAmount = 131313.31;
  const minDepositAmount = 10;

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

  const formattedCompactPriceUSD =
    NFT_DETAIL.priceUSD >= 1000 ? ` (${formatUSD(NFT_DETAIL.priceUSD, { compact: true, semiequate: true })})` : '';
  const formattedPriceUSD = `${formatUSD(NFT_DETAIL.priceUSD)}${formattedCompactPriceUSD}`;

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Raising Vault</Heading>

      <section className="space-y-4 mt-20">
        <div className="flex items-stretch gap-x-14">
          <NFTTumbnail size="xl" imgSrc={NFT_DETAIL.imgSrc} className="grow-0 shrink-0" />

          <div className="grow shrink space-y-4">
            <div className="flex items-center justify-between gap-x-4">
              <Heading tagName="h3">{NFT_DETAIL.nftName}</Heading>

              <ChainLabel chain={NFT_DETAIL.chain} />
            </div>

            <Card color="glass" className="flex flex-col items-stretch gap-y-2 p-4 text-body">
              <div className="flex items-stretch justify-between gap-x-2 text-body">
                <span className="h-6 flex flex-col justify-center Font_label_14px">Participants</span>

                <span className="flex items-baseline gap-x-1 Font_data_16px_num">
                  {formatNumber(NFT_DETAIL.participants)}
                  <span className="Font_caption_xs">joining</span>
                </span>
              </div>

              <div className="flex flex-col items-end gap-y-4">
                <ProgressBar
                  currentNumber={NFT_DETAIL.raisedAmountUSD}
                  targetNumber={NFT_DETAIL.price}
                  formatOptions={{ currencySymbol: '$' }}
                  currentNumberCaption={`raised`}
                />
              </div>
            </Card>

            <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
              {/* <div className="flex items-stretch justify-between gap-x-4 text-body"> */}
              <div className="h-6 flex flex-col justify-center Font_label_14px">Fixed price</div>

              <div className="flex flex-col gap-y-2 items-end">
                <CoinAmount size="md" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(NFT_DETAIL.price)} />
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
                  <span className="Font_caption_md_num text-ground">{formatUSD(13131.11)}</span>
                </div>
              </div>
            </Card>

            {!isDepositFormOpen && (
              <div className="flex justify-end items-center gap-x-4">
                <Button
                  color="primary"
                  size="lg"
                  label="Participate"
                  iconType="arrow_forward"
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
                      form={form.current}
                      type="number"
                      required
                      min="0"
                      placeholder="0.0"
                      initialValue={depositAmount.toString()}
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
