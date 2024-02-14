import Button from '@/components/Button';
import useAccountOrConnectButton from './useAccountOrConnectButton';
import {ButtonSize} from '@/components/Button/types';
import {Abstraxion} from '@burnt-labs/abstraxion';

const AccountButton = ({size, className = ''}: {size?: ButtonSize; className?: string}) => {
  const {buttonProps, modal, setXionModal} = useAccountOrConnectButton();

  return (
    <>
      <Button
        size={size}
        className={`min-w-[11.875rem] ${className}`}
        aria-expanded={modal?.isOpen}
        aria-controls={modal?.id}
        {...buttonProps}
      />
      <Abstraxion onClose={() => setXionModal(false)} />
    </>
  );
};

export default AccountButton;
