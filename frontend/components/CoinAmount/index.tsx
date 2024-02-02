import NumberText, { type NumberTextSize } from '@/components/NumberText';
import CoinLabel from '@/components/CoinLabel';
import { CoinLabelSize } from '@/components/CoinLabel/styles';
import { TextColor } from '@/components/styles';
import { TokenSymbols } from '@/constants/app';
import Coin, { type CoinSize } from '@/components/Coin';

export type CoinAmountColor = TextColor;

const COIN_SIZE_MAPPING_DICT: Record<NumberTextSize, CoinSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
};

export type CoinAmountProps = {
  color?: CoinAmountColor;
  size: NumberTextSize;
  symbol?: TokenSymbols;
  formattedAmount?: string;
  amountUnit?: string;
};

const CoinAmount = ({ formattedAmount, color = 'body', size, symbol, amountUnit }: CoinAmountProps) => {
  const coinSize = COIN_SIZE_MAPPING_DICT[size];

  return (
    <span className="w-fit flex items-center gap-x-2.5">
      {/* <CoinLabel color={color} size={coinLabelSize} symbol={symbol} /> */}
      <Coin size={coinSize} symbol={symbol} />
      <NumberText color={color} size={size} formattedNumber={formattedAmount} unit={symbol} />
    </span>
  );
};

export default CoinAmount;
