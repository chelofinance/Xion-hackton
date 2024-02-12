import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { allTokensDictAtom } from '@/store/states';
import { TokenSymbols } from '@/constants/app';

const useCoinLogoURL = (symbol?: TokenSymbols) => {
  const [tokensDict] = useAtom(allTokensDictAtom);

  return useMemo<string | undefined>(() => {
    return symbol ? tokensDict[symbol]?.logoURI : undefined;
  }, [symbol, tokensDict]);
};

export default useCoinLogoURL;
