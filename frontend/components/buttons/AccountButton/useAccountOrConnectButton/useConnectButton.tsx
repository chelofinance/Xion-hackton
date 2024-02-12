import { useMemo } from 'react';
import type { IconType } from '@/components/Icon';
import type { ButtonColor, ButtonStatus } from '@/components/Button/types';
import type { ButtonProps } from '@/components/Button';
import useConnect from '@/connection/useConnect';
import { abstraxion } from '@/constants/wallet';

const useConnectButton = (): {
  connectModalButtonProps: Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'>;
  // connectModal: ReturnType<typeof useModal>;
  connectModal: null;
} => {
  // const wallets = useWallets();

  // const [, setUserWallet] = useAtom(userWalletAtom);

  // const { isConnecting } = useAutoConnect(Object.values(wallets));
  const { connect, connectingWallet } = useConnect();

  const connectModalButtonProps = useMemo(() => {
    const isConnecting = !!connectingWallet;

    const label = 'Connect';
    const onClick = () => connect(abstraxion);
    const status: ButtonStatus = isConnecting ? 'processing' : 'enabled';
    const color: ButtonColor = 'primary';
    const iconType: IconType = 'login';

    return {
      status,
      color,
      iconType,
      label,
      onClick,
    };
  }, [connectingWallet, connect]);

  return {
    connectModalButtonProps,
    connectModal: null,
  };
};

export default useConnectButton;
