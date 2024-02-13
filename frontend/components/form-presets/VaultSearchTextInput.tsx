import { useCallback, useEffect, useRef, useState } from 'react';
import TextInput from '@/components/TextInput';
import Card from '@/components/Card';
import CheckItem from '@/components/CheckItem';
import useFocusHandle from '@/hooks/useFocusHandle';
import Divider from '@/components/Divider';

import { shortenAddress } from '@/utils/text';
import OverlayGrid from '../OverlayGrid';
import Image from 'next/image';
import { SUPPORTED_CHAINS, SUPPORTED_CHAINS_DICT, AppChains } from '@/constants/app';

type FetchedMultiSigWallet = {
  address: string;
  name: string;
};

const FETCHED_MULTISIG_WALLETS: FetchedMultiSigWallet[] = [
  {
    address: 'archway15uwy6eqnrre0l87zjndk96e5zhf2j22lcwkha7l8s3gu5380qzxqkccdkh',
    name: 'MultiSig 1',
  },
  {
    address: 'archway15uwy6eqnrre0l87zjndk96e5zhf2j22lcwkha7l8s3gu5380qzxqkccdkh',
    name: 'MultiSig 1',
  },
  {
    address: 'archway15uwy6eqnrre0l87zjndk96e5zhf2j22lcwkha7l8s3gu5380qzxqkccdkh',
    name: 'MultiSig 1',
  },
];

const VaultSearchTextInput = ({
  className = '',
  ...args
}: {
  className?: string;
  label: string;
  placeholder: string;
  getErrorMsg?: () => string | null;
}) => {
  const form = useRef<HTMLFormElement>(null);

  const [debouncedValue, setDebouncedValue] = useState<string>('');

  const onChange = useCallback((debouncedValue: string, isValid: boolean) => {
    setDebouncedValue(debouncedValue);
  }, []);

  const { isFocused, onFocus, onBlur, blurEscapeElementRef, containerElementRef } = useFocusHandle<
    HTMLDivElement,
    HTMLDivElement
  >();

  /**
   *
   * @description handle checked chains to filter vaults
   */
  const [checkedChains, setCheckedChains] = useState<AppChains[]>([SUPPORTED_CHAINS[0]]);

  const getIsChainChecked = useCallback(
    (chain: AppChains) => {
      return !!checkedChains.find((checkedChain) => checkedChain === chain);
    },
    [checkedChains]
  );

  const onChangeChainChecked = useCallback(
    (supportedChain: AppChains, isChecked: boolean) => {
      const newCheckedChains = isChecked
        ? [...checkedChains, supportedChain]
        : checkedChains.filter((checkedChain) => checkedChain !== supportedChain);
      setCheckedChains(newCheckedChains);
    },
    [checkedChains]
  );

  return (
    <div ref={containerElementRef} className={`flex flex-col items-stretch ${className}`}>
      <form ref={form}>
        <TextInput form={form.current} type="text" onChange={onChange} onFocus={onFocus} onBlur={onBlur} {...args}>
          <TextInput.Icon type="search" />
        </TextInput>
      </form>

      {isFocused && (
        <div className="relative">
          <Card
            ref={blurEscapeElementRef}
            color="glass"
            size="sm"
            className="absolute top-4 inset-x-0 z-overlay p-2 flex flex-col items-stretch gap-y-2"
          >
            <div className="flex items-center gap-x-2">
              {SUPPORTED_CHAINS.map((supportedChain) => (
                <CheckItem
                  key={supportedChain}
                  checked={getIsChainChecked(supportedChain)}
                  imgURL={SUPPORTED_CHAINS_DICT[supportedChain].logoURL}
                  label={supportedChain}
                  onChange={(isChecked) => onChangeChainChecked(supportedChain, isChecked)}
                />
              ))}
            </div>

            <Divider />

            <div className="py-2 space-y-2">
              <div className="Font_caption_sm text-body">
                {debouncedValue.length > 0 ? 'Results' : 'Join trending multisig vaults'}
              </div>
              <ul>
                {FETCHED_MULTISIG_WALLETS.map((fetchedMultisigWallet) => (
                  <div key={fetchedMultisigWallet.address} className="flex items-center justify-between gap-x-2 p-2">
                    <div className="grow shrink flex items-center gap-x-2">
                      <div className="w-4 h-4 rounded-full bg-caption overflow-hidden text-transparent">Wallet Avatar</div>
                      <div className="Font_label_14px text-body">{fetchedMultisigWallet.name}</div>
                      <div className="Font_caption_xs text-caption_dark">{shortenAddress(fetchedMultisigWallet.address)}</div>
                    </div>

                    <OverlayGrid xUnitPx={12} className="!w-10">
                      {SUPPORTED_CHAINS.slice(1).map((supportedChain) => (
                        <OverlayGrid.Item key={supportedChain}>
                          <Image
                            src={SUPPORTED_CHAINS_DICT[supportedChain].logoURL}
                            width={20}
                            height={20}
                            alt={supportedChain}
                            className="rounded-full overflow-hidden border border-solid border-primary_line_light"
                          />
                        </OverlayGrid.Item>
                      ))}
                    </OverlayGrid>
                  </div>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VaultSearchTextInput;
