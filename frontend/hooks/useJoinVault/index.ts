import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {useState} from 'react';
import {joinVault as joinVaultAsMember} from '@/utils/multisig';
import useProcessing from '../useProcessing';
import {COIN_DICT, TokenSymbols, AllChains} from '@/constants/app';

const WEIGHT_DECIMALS = 1000000000000000;

const useJoinVault = (): {
  joinVault: (multisigVaultAddress: string) => Promise<void>;
  processing: boolean;
} => {
  const {client: abstraxionClient} = useAbstraxionSigningClient();
  const {data: account} = useAbstraxionAccount();
  const {target, startProcessing, stopProcessing} = useProcessing<boolean>();

  const [feeAmount, setFeeAmount] = useState<string>((1 * WEIGHT_DECIMALS).toString());

  const joinVault = async (multisigVaultAddress: string) => {
    startProcessing(true);

    try {
      const coin = COIN_DICT[TokenSymbols.INJ].denomOn[AllChains.XION_TESTNET];
      const response = await joinVaultAsMember(
        abstraxionClient,
        account,
        multisigVaultAddress,
        account.bech32Address,
        feeAmount,
        coin
      );
      console.log('response', response);
    } catch (err) {
      console.log('ADD MEMBER ERR', err);
    }

    stopProcessing();
  };

  return {
    joinVault,
    processing: Boolean(target),
  };
};

export default useJoinVault;
