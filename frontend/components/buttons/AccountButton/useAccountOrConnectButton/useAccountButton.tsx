import { Suspense, lazy, useCallback, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';
import useModal from '@/hooks/useModal';
import type { IconType } from '@/components/Icon';
import type { OnConnect } from '@/components/overlays/SelectWalletOverlay';
import type { ButtonColor, ButtonStatus } from '@/components/Button/types';
import type { ButtonProps } from '@/components/Button';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion';

const XionWalletConnectOverlay = lazy(() => import('@/components/overlays/XionWalletConnectOverlay'));

const useAccountButton = (): {
  accountButtonProps: Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'> | null;
  accountModal: ReturnType<typeof useModal> | null;
} => {
  // const wallets = useWallets();

  const [, setUserWallet] = useAtom(userWalletAtom);

  // const { isConnecting } = useAutoConnect(wallets);
  // // const isConnecting = false;

  const { data: xionAccount, isConnected: isXionAcccountConnected } = useAbstraxionAccount();

  useEffect(() => {
    console.log('xionAccount', xionAccount);
    console.log('isXionAcccountConnected', isXionAcccountConnected);
}, [xionAccount, isXionAcccountConnected]);

  const accountModal = useModal();

  const onConnect: OnConnect = useCallback(
    ({ wallet }) => {
      setUserWallet(wallet);
    },
    [setUserWallet]
  );

  const openAccountModal = useCallback(async () => {
    await accountModal.open((props) => (
      <Suspense>
        <XionWalletConnectOverlay {...props} id={accountModal.id} onConnect={onConnect} />
      </Suspense>
    ));
  }, [accountModal, onConnect]);

  const accountButtonProps = useMemo(() => {
    if (!isXionAcccountConnected) return null;

    const label = xionAccount.bech32Address;
    const onClick = openAccountModal;
    const status: ButtonStatus = 'enabled';
    const color: ButtonColor = 'primary';
    const iconType: IconType = 'login';

    return {
      status,
      color,
      iconType,
      label,
      onClick,
    };
  }, [openAccountModal, accountModal.isOpen, xionAccount.bech32Address, isXionAcccountConnected]);

  return {
    accountButtonProps,
    accountModal: accountButtonProps === null ? null : accountModal,
  };
};

export default useAccountButton;
