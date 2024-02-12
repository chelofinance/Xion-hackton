import { useRef } from 'react';
import TextInput from '@/components/TextInput';
import { TextInputProps } from '@/components/TextInput/Container';

type AmountInputProps = Omit<TextInputProps, 'type' | 'form' | 'min' | 'initialValue' | 'errorMsg' | 'onChange'> & {
  initialValue?: number;
  getErrorMsg?: (value: string) => string | null;
  onChange?: (debouncedValue: string, isValid: boolean) => void;
};

const AmountInput = ({ initialValue, getErrorMsg, onChange, ...args }: AmountInputProps) => {
  const form = useRef<HTMLFormElement>(null);

  const { placeholder, max } = args;

  return (
    <TextInput
      form={form.current}
      type="number"
      min="0"
      max={max}
      placeholder={placeholder ?? '0.0'}
      initialValue={initialValue?.toString()}
      getErrorMsg={getErrorMsg}
      onChange={onChange}
    >
      {/* <TextInput.Icon type="search" /> */}
    </TextInput>
  );
};

export default AmountInput;
