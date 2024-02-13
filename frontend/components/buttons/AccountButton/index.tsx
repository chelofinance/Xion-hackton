import Button, {ButtonProps} from '@/components/Button';
import {ButtonSize} from '@/components/Button/types';
import {Abstraxion, useModal, useAbstraxionAccount} from '@burnt-labs/abstraxion';

const ACCOUNT_SIZE = 8;

const AccountButton = ({size, className = ''}: {size?: ButtonSize; className?: string}) => {
  const [open, setModal] = useModal();
  const {data: account, isConnected} = useAbstraxionAccount();
  const onClick = () => setModal(true);
  const buttonProps: ButtonProps = isConnected
    ? {
      status: 'enabled',
      color: 'primary',
      type: 'outline',
      iconType: 'login',
      label: `${account.bech32Address.slice(0, ACCOUNT_SIZE)}...${account.bech32Address.slice(-ACCOUNT_SIZE)}`,
      onClick,
    }
    : {color: 'primary', iconType: 'login', label: 'Connect', onClick, status: 'enabled'};

  return (
    <>
      <Button size={size} className={`min-w-[11.875rem] ${className}`} {...buttonProps} />
      <Abstraxion onClose={() => setModal(false)} />
    </>
  );
};

export default AccountButton;
