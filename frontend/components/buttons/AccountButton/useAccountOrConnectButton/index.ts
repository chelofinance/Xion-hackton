import { ButtonProps } from '@/components/Button';
import useConnectButton from './useConnectButton';
import useModal from '@/hooks/useModal';

const useAccountOrConnectButton = (): {
  buttonProps: Pick<ButtonProps, 'status' | 'color' | 'iconType' | 'label' | 'onClick'>;
  modal: ReturnType<typeof useModal>;
} => {
  const { connectModalButtonProps, connectModal } = useConnectButton();

  const buttonProps = connectModalButtonProps;
  const modal = connectModal;

  return {
    buttonProps,
    modal,
  };
};

export default useAccountOrConnectButton;
