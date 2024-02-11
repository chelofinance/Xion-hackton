import Image from 'next/image';
import { useCallback, useState } from 'react';
import { AllChains, TokenSymbols } from '@/constants/app';
import { TextColor, TEXT_COLOR_CLASS_DICT } from '@/components/styles';
import useCoinLogoURL from '@/components/useCoinLogoURL';

export type ChainLabelColor = TextColor;

export type ChainLabelSize = 'sm' | 'md' | 'lg' | 'xl';

const COLOR_CLASS_DICT = TEXT_COLOR_CLASS_DICT;

const CHAIN_REP_TOKEN_SYMBOL_DICT: Record<AllChains, TokenSymbols> = {
  [AllChains.INJECTIVE_TESTNET]: TokenSymbols.INJ,
};

const ChainLabel_SIZE_DICT: Record<ChainLabelSize, { px: number; className: string }> = {
  sm: { px: 16, className: 'w-4 h-4' },
  md: { px: 20, className: 'w-5 h-5' },
  lg: { px: 24, className: 'w-6 h-6' },
  xl: { px: 32, className: 'w-8 h-8' },
};

type ChainLabelProps = {
  chain: AllChains;
  color?: ChainLabelColor;
  size?: ChainLabelSize;
  logoURL?: string;
  logoOnly?: boolean;
};

const ChainLabel = ({ chain, color = 'body', size = 'md', logoURL: injectedLogoURL, logoOnly = false }: ChainLabelProps) => {
  const logoURL = useCoinLogoURL(CHAIN_REP_TOKEN_SYMBOL_DICT[chain]);
  const renderingLogoURL = injectedLogoURL ?? logoURL;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const onLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const [isError, setIsError] = useState<boolean>(false);
  const onError = useCallback(() => {
    console.log('error');
    setIsError(true);
  }, []);

  const colorClassName = COLOR_CLASS_DICT[color];
  const pxSizes = { width: ChainLabel_SIZE_DICT[size].px, height: ChainLabel_SIZE_DICT[size].px };
  const sizeClassName = ChainLabel_SIZE_DICT[size].className;
  const opacityClassName = `transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`;

  const Logo = !isError && renderingLogoURL ? (
    <Image
      alt={`${chain} logo`}
      src={renderingLogoURL}
      {...pxSizes}
      className={`rounded-full ${sizeClassName} ${opacityClassName}`}
      onLoadingComplete={onLoaded}
      onError={onError}
    />
  ) : (
    <div aria-hidden className={`${sizeClassName} rounded-full animate-pulse`}></div>
  );

  return logoOnly ? Logo : (
    <div className="flex items-center gap-x-2">
      {Logo}
      <div className={`Font_label_14px ${colorClassName}`}>{chain}</div>
    </div>
  );
};

export default ChainLabel;
