import type {MyNFTVault, MyVault, NFTVault, RaisingNFT} from '@/types/asset';
import {
    GetMultisigThresholdResponse,
    GetVotersResponse,
    ProposalResponse,
    VoterResponse,
    getMultisigThreshold,
    getVaultMultisigs,
    getVoters,
} from '@/utils/xion';
import {useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {useCallback, useEffect, useState} from 'react';
import useProposals from '../useProposals';
import {useAtom} from 'jotai';
import {myVaultsAtom} from '@/store/states';

const useMyVaults = (
    address: string | undefined
): {
    myVaults: readonly MyVault[];
    updateMyVaults: () => Promise<void>;
} => {
    const [myVaults, setMyVaults] = useAtom(myVaultsAtom);

    const {client: abstraxionClient} = useAbstraxionSigningClient();

    const {getVaultProposals} = useProposals(address);

    const updateMyVaults = useCallback(async () => {
        if (!address || address === '') {
            console.log('Address not found.');
            return;
        }

        if (!abstraxionClient) {
            console.log('Signing client not found.');
            return;
        }

        const vaultMultisigs = await getVaultMultisigs(abstraxionClient, address);

        const vaults = await Promise.all(
            vaultMultisigs.map(async (vaultMultisig) => {
                const voters = (await getVoters(abstraxionClient, vaultMultisig.multisigAddress))?.voters;
                const threshold = (await getMultisigThreshold(abstraxionClient, vaultMultisig.multisigAddress))?.absolute_count;
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
    }, [abstraxionClient, address, getVaultProposals]);

    return {
        myVaults,
        updateMyVaults,
    };
};

export default useMyVaults;
