import {MyVault} from '@/types/asset';
import {HandleDepositArgs, transferOnXion} from '@/utils/xion';
import {useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {useCallback} from 'react';
import useProcessing from '../useProcessing';

const useDepositToVaultMultisig = () => {
    const {client: abstraxionClient} = useAbstraxionSigningClient();

    const {target, startProcessing, stopProcessing} = useProcessing<boolean>();

    const depositToVaultMultisig = useCallback(
        async (vault: MyVault, args: Omit<HandleDepositArgs, 'recipientAddress'>) => {
            console.log('depositToVaultMultisig');
            if (!abstraxionClient) {
                console.log('Signing client not found');
                return null;
            }

            startProcessing(true);

            const recipientAddress = vault.icaControllerAddress;

            const result = await transferOnXion(abstraxionClient, {
                ...args,
                recipientAddress,
            });

            if (result.isSuccess) {
                alert('Succeed to send tx:' + result.response.transactionHash);
            } else {
                console.log(`Failed to send tx: ${result.response?.rawLog ?? 'unknown error'}`, result.response);
            }

            stopProcessing();

            return result;
        },
        [abstraxionClient]
    );

    return {
        depositToVaultMultisig,
        isProcessing: !!target,
    };
};

export default useDepositToVaultMultisig;
