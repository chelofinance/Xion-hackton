import {MyVault} from '@/types/asset';
import {executeProposal as execute} from '@/utils/multisig';
import {useCallback} from 'react';
import useProcessing from '../useProcessing';
import {AbstraxionAccount} from '@/types/wallet';
import {useAbstraxionSigningClient} from '@burnt-labs/abstraxion';

const useExecuteProposal = (account: AbstraxionAccount) => {
    const {target, startProcessing, stopProcessing} = useProcessing<boolean>();
    const {client} = useAbstraxionSigningClient();

    const executeProposal = useCallback(
        async (vault: MyVault, proposalId: string | number) => {
            if (!client) {
                console.log('Signing client not found');
                return null;
            }

            startProcessing(true);

            const result = await execute(client, account, vault.multisigAddress, Number(proposalId));

            if (result.success) {
                alert('Succeed to send tx:' + (result?.response as any).transactionHash);
            } else {
                console.log('ERR on tx', result.response);
            }

            stopProcessing();

            return result;
        },
        [client, account, startProcessing, stopProcessing]
    );

    return {
        executeProposal,
        isProcessing: !!target,
    };
};

export default useExecuteProposal;
