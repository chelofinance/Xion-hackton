import { Suspense, lazy, useCallback, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';
import useModal from '@/hooks/useModal';
import type { IconType } from '@/components/Icon';
import type { OnConnect } from '@/components/overlays/SelectWalletOverlay';
import type { ButtonColor, ButtonStatus, ButtonType } from '@/components/Button/types';
import type { ButtonProps } from '@/components/Button';
import { shortenAddress } from '@/utils/text';

const AccountOverlay = lazy(() => import('@/components/overlays/AccountOverlay'));

const useAccountButton = (): {
  accountButtonProps: Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'> | null;
  accountModal: ReturnType<typeof useModal> | null;
} => {
  const [userWallet, setUserWallet] = useAtom(userWalletAtom);

  const disconnect = useCallback(() => {
    setUserWallet(null);
  }, []);

  const accountModal = useModal();

  const openAccountModal = useCallback(async () => {
    if (userWallet === null) return;

    await accountModal.open((props) => (
      <Suspense>
        <AccountOverlay
          wallet={userWallet}
          onWillDisconnect={() => {
            const { onClose } = props;
            disconnect();
            onClose();
          }}
          {...props}
        />
      </Suspense>
    ));
  }, [userWallet, disconnect, accountModal]);

  const accountButtonProps = useMemo(() => {
    if (userWallet === null) return null;

    const label = shortenAddress(userWallet.address);
    const onClick = openAccountModal;
    const color: ButtonColor = 'primary';
    const type: ButtonType = 'outline';
    const status: ButtonStatus = 'enabled';
    const iconType: IconType = 'login';

    return {
      status,
      color,
      type,
      iconType,
      label,
      onClick,
    };
  }, [openAccountModal, accountModal.isOpen, userWallet]);

  return {
    accountButtonProps,
    accountModal: accountButtonProps === null ? null : accountModal,
  };
};

export default useAccountButton;
