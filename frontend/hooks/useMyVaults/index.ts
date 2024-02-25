import type {MyVault} from '@/types/asset';
import {
    XionSigningClient,
    getMultisigThreshold,
    getVaultMultisigs,
    getVoters,
} from '@/utils/xion';
import {useCallback} from 'react';
import useProposals from '../useProposals';
import {useAtom} from 'jotai';
import {myVaultsAtom} from '@/store/states';

const useMyVaults = (
    client: XionSigningClient,
    address: string | undefined
): {
    myVaults: readonly MyVault[];
    updateMyVaults: () => Promise<void>;
} => {
    const [myVaults, setMyVaults] = useAtom(myVaultsAtom);

    const {getVaultProposals} = useProposals(address);

    const updateMyVaults = useCallback(async () => {
        if (!address || address === '') {
            console.log('Address not found.');
            return;
        }

        if (!client) {
            console.log('Signing client not found.');
            return;
        }

        const vaultMultisigs = await getVaultMultisigs(client, address);

        const vaults = await Promise.all(
            vaultMultisigs.map(async (vaultMultisig) => {
                const voters = (await getVoters(client, vaultMultisig.multisigAddress))?.voters;
                const threshold = (await getMultisigThreshold(client, vaultMultisig.multisigAddress))?.absolute_count;
                const proposals = await getVaultProposals(vaultMultisig.multisigAddress);

                const myWeight = voters?.find((voter) => voter.addr === address)?.weight ?? '1';
                const share = parseFloat(myWeight) / parseFloat(threshold?.total_weight ?? '1');

                return {
                    ...vaultMultisig,
                    voters,
                    threshold,
                    proposals,
                    share,
                };
            })
        );

        setMyVaults(vaults);
    }, [client, address, getVaultProposals]);

    return {
        myVaults,
        updateMyVaults,
    };
};

export default useMyVaults;
