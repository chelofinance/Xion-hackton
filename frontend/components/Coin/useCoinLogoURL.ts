import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { allTokensDictAtom } from '@/store/states';

const useCoinLogoURL = (symbol?: string) => {
  const [tokensDict] = useAtom(allTokensDictAtom);

  return useMemo<string | undefined>(() => {
    return tokensDict[symbol ?? '']?.logoURI;
  }, [symbol, tokensDict]);
};

export default useCoinLogoURL;
