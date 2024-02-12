import { ButtonProps } from '@/components/Button';
import useConnectButton from './useConnectButton';
import useModal from '@/hooks/useModal';
import useAccountButton from './useAccountButton';

const useAccountOrConnectButton = (): {
  buttonProps: Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'>;
  modal: ReturnType<typeof useModal> | null;
} => {
  const { accountButtonProps, accountModal } = useAccountButton();
  const { connectModalButtonProps, connectModal } = useConnectButton();

  const buttonProps = accountButtonProps ?? connectModalButtonProps;
  const modal = accountModal ?? connectModal;

  return {
    buttonProps,
    modal,
  };
};

export default useAccountOrConnectButton;
