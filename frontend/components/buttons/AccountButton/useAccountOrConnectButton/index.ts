import useConnectButton from './useConnectButton';

const useAccountOrConnectButton = () => {
  const { connectModalButtonProps, connectModal } = useConnectButton();

  const buttonProps = connectModalButtonProps;
  const modal = connectModal;

  return {
    buttonProps,
    modal,
  };
};

export default useAccountOrConnectButton;
