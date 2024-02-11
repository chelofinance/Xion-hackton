import { type NumberTextSize } from '@/components/NumberText';

const TEXT_SIZE_MAPPING_DICT: Record<NumberTextSize, string> = {
  sm: 'Font_caption_xs_num',
  md: 'Font_caption_sm_num',
  lg: 'Font_caption_md_num',
  xl: 'Font_caption_lg_num',
};

export type CaptionAmountProps = {
  size: NumberTextSize;
  formattedAmount?: string;
  amountUnit?: string;
};

const CaptionAmount = ({ formattedAmount, size, amountUnit }: CaptionAmountProps) => {
  const fontSizeClassName = TEXT_SIZE_MAPPING_DICT[size];

  return (
    <span className={`text-caption ${fontSizeClassName}`}>{formattedAmount}</span>
  );
};

export default CaptionAmount;
