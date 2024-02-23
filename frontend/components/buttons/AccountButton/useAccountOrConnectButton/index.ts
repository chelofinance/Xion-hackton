import {ButtonProps} from '@/components/Button';
import useConnectButton from './useConnectButton';
import {useModal as useXionModal, useAbstraxionAccount} from '@burnt-labs/abstraxion';
import useModal from '@/hooks/useModal';
import useAccountButton from './useAccountButton';
import { shortenAddress } from '@/utils/text';
import { useEffect, useMemo } from 'react';
import { ButtonColor, ButtonStatus, ButtonType } from '@/components/Button/types';
import { IconType } from '@/components/Icon';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';
import { abstraxion } from '@/constants/wallet';
import useMyVaults from '@/hooks/useMyVaults';

type AccountButtonProps = Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'>;

const useAccountOrConnectButton = (): {
  buttonProps: AccountButtonProps;
  modal: ReturnType<typeof useModal> | null;
  xionModal: boolean;
  setXionModal: ReturnType<typeof useXionModal>[1];
} => {
  const { accountModal } = useAccountButton();
  const { connectModal } = useConnectButton();

  //TODO i need this since xion connects differently from other cosmos chains.
  //To use account abstraction we must login with account abstraction, not with keplr wallet
  const [xionModal, setXionModal] = useXionModal();
  const {data: account, isConnected} = useAbstraxionAccount();

  const accountButtonProps = useMemo(() => {
    const label = isConnected ? shortenAddress(account.bech32Address) : 'Connecting';
    const onClick = () => setXionModal(true);
    const color: ButtonColor = 'primary';
    const type: ButtonType = 'outline';
    const status: ButtonStatus = 'enabled';
    const iconType: IconType = 'login'

    return {
      status,
      color,
      type,
      iconType,
      label,
      onClick,
    };
  }, [isConnected, account.bech32Address, setXionModal]);

  const buttonProps: AccountButtonProps = (
    isConnected
      ? accountButtonProps
      : { label: 'Connect', iconType: 'arrow_forward', onClick: () => setXionModal(true)}
  );
  const modal = accountModal ?? connectModal;
  // END xion login

  const [userWallet, setUserWallet] = useAtom(userWalletAtom);

  useEffect(() => {
    if (!isConnected || account.bech32Address === '') {
      setUserWallet(null);
      return;
    }

    const userWallet = {
      ...abstraxion,
      account: { address: account.bech32Address }
    };
    
    setUserWallet(userWallet);
  }, [account.bech32Address, isConnected]);

  useEffect(() => {
    if (isConnected && account.bech32Address !== '') {
      const userWallet = {
        ...abstraxion,
        account: { address: account.bech32Address }
      };
      
      setUserWallet(userWallet);
    }
  }, []);

  const { updateMyVaults } = useMyVaults(userWallet?.account.address);

  useEffect(() => {
    updateMyVaults();
  }, [updateMyVaults]);

  return {
    buttonProps,
    modal,
    xionModal,
    setXionModal,
  };
};

export default useAccountOrConnectButton;
