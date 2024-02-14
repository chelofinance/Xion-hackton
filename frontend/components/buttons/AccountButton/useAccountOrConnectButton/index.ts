import {ButtonProps} from '@/components/Button';
import useConnectButton from './useConnectButton';
import {useModal as useXionModal, useAbstraxionAccount} from '@burnt-labs/abstraxion';
import useModal from '@/hooks/useModal';
import useAccountButton from './useAccountButton';

type AccountButtonProps = Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'>;

const useAccountOrConnectButton = (): {
  buttonProps: AccountButtonProps;
  modal: ReturnType<typeof useModal> | null;
  xionModal: boolean;
  setXionModal: ReturnType<typeof useXionModal>[1];
} => {
  const {accountButtonProps, accountModal} = useAccountButton();
  const {connectModalButtonProps, connectModal} = useConnectButton();

  //TODO i need this since xion connects differently from other cosmos chains.
  //To use account abstraction we must login with account abstraction, not with keplr wallet
  const [xionModal, setXionModal] = useXionModal();
  const {data: account, isConnected} = useAbstraxionAccount();
  const buttonProps = (
    isConnected
      ? {...accountButtonProps, label: account.bech32Address, onClick: () => setXionModal(true)}
      : {...connectModalButtonProps, onClick: () => setXionModal(true)}
  ) as AccountButtonProps;
  const modal = accountModal ?? connectModal;
  // END xion login

  return {
    buttonProps,
    modal,
    xionModal,
    setXionModal,
  };
};

export default useAccountOrConnectButton;
