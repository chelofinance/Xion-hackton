import { useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import type { Wallet } from '@/types/wallet';
import { userWalletAtom } from '@/store/states';

const useWallets = (): readonly Wallet[] => {
  const [, setUserWallet] = useAtom(userWalletAtom);

  const resetUserWallet = useCallback(() => setUserWallet(null), [setUserWallet]);

  const xion: Wallet = useMemo(
    () => ({
      type: 'xion',
      name: 'Xion',
      logoURL: '',
      onNoConnector: () => {
        window.open('https://dashboard.burnt.com/', '_blank');
      },
    }),
    [resetUserWallet]
  );

  return [xion];
};

export default useWallets;
