import {AppChains, chainConfigMap, INJ_ICA_ACCOUNT_PLACEHOLDER} from '@/constants/app';
import type {MyNFTVault, NFTVault, ICA, Multisig, RaisingNFT} from '@/types/asset';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {useCallback, useEffect, useState} from 'react';
import useRaisingNFTVaults from '@/hooks/useRaisingNFTVaults';

type ProposalResponse = {
    id: string;
    title: string;
    description: string;
    msgs: any[];
    status: string;
    threshold: unknown;
    proposer: string;
    deposit: unknown;
};

type VotersResponse = {
    voters: {addr: string; weight: string}[];
};

type ThresholdResponse = {
    absolute_count: {weight: string; total_weight: string};
};

type ControllerResponse = {
    ica_info: string | null;
    allow_channel_open_init: false;
    callback_address: string;
};

/**
 *
 * @todo query the NFT vaults which includes me as a member
 */
const useMyNFTVaults = (): readonly MyNFTVault[] => {
    const [myVaults, setMyVaults] = useState<MyNFTVault[]>([]);
    const {client} = useAbstraxionSigningClient();
    const {data: account, isConnected} = useAbstraxionAccount();
    const nfts = useRaisingNFTVaults();

    const getNftByProposal = (prop: ProposalResponse) => {
        const nft = nfts.find((nft) => prop.msgs.some((msg) => msg.wasm?.execute.contract_addr === nft.buyContractAddress));
        return {
            nft: nft as RaisingNFT, // we must always have an nft by proposal
            ...prop,
        };
    };

    const loadVaultInfo = async (vault: string, client: any) => {
        console.log('LOAD VAULT INFo', vault, {list_proposals: {start_after: 0}});
        const proposals = (await client?.queryContractSmart(vault, {list_proposals: {start_after: 0}})) as {
            proposals: ProposalResponse[];
        };
        console.log(proposals, vault, {list_voters: {}});
        const voters = (await client?.queryContractSmart(vault, {list_voters: {}})) as VotersResponse;
        console.log(voters, vault, {threshold: {}});
        const threshold = (await client?.queryContractSmart(vault, {threshold: {}})) as ThresholdResponse;
        console.log(threshold);
        const matchedNfts = proposals.proposals.map((prop) => getNftByProposal(prop));
        console.log(matchedNfts);

        return {
            proposals: matchedNfts,
            voters,
            threshold,
        };
    };

    const loadControllerInfo = async (controller: string, client: any) => {
        const info: ControllerResponse = await client?.queryContractSmart(controller, {get_contract_state: {}});
        return {
            controller,
            ...info,
        };
    };

    const loadVaults = useCallback(async () => {
        const factory = chainConfigMap[AppChains.XION_TESTNET].icaFactory.address;
        const response: {multisigs: string[]; controllers: string[]} = await client?.queryContractSmart(factory, {
            query_multisig_by_member: account.bech32Address,
        });
        console.log(
            'RESPONSE',
            response,
            factory,
            {
                query_multisig_by_member: account.bech32Address,
            },
            client
        );
        const multisigs = response.multisigs || [];
        const controllers = response.controllers || [];

        const vaultProps = await Promise.all(multisigs.map((vault) => loadVaultInfo(vault, client)));
        console.log({vaultProps});
        const controllerProps = await Promise.all(controllers.map((vault) => loadControllerInfo(vault, client)));
        console.log({controllerProps});

        const ica: ICA[] = controllerProps.map((cont, i) => ({
            icaMultisigAddress: cont.controller,
            icaControllerAddress: cont.ica_info || INJ_ICA_ACCOUNT_PLACEHOLDER,
        }));
        console.log({ica});
        const multisig: Multisig[] = vaultProps.map((cont) => ({
            voters: cont.voters.voters.map((vot) => ({
                addr: vot.addr,
                weight: Number(vot.weight),
                share: 100, //TODO calculate share
            })),
            govThreshold: Number(cont.threshold.absolute_count),
        }));
        console.log({multisig});

        const finalVaults: MyNFTVault[] = vaultProps.map((prop, i) => ({
            share: 100,
            multisig: multisig[i],
            ica: ica[i],
            nfts: prop.proposals.map(({nft}) => nft),
        }));

        setMyVaults(finalVaults);
    }, [isConnected, client]);

    useEffect(() => {
        if (nfts.length > 0 && client && isConnected) loadVaults();
    }, [nfts.length, loadVaults]);

    return myVaults;
};

export default useMyNFTVaults;
