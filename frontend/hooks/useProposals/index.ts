import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useCallback, useEffect } from "react";
import { voteProposal as voteMultisigProposal } from "@/utils/multisig";
import { ProposalStatus } from "@/constants/app";
import { ProposalResponse, getMultisigThreshold, getProposals, getVoters } from "@/utils/xion";
import useRaisingNFTVaults from "../useRaisingNFTVaults";
import { RaisingNFT } from "@/types/asset";

type Proposal = {
    id: string;
    description: string;
    status: ProposalStatus;
}

const useProposals = (address: string | undefined): { 
    getVaultProposals: (icaMultisigAddress: string) => Promise<readonly {
        nft: RaisingNFT;
        proposal: ProposalResponse;
    }[]>;
    voteProposal:(icaMultisigAddress: string, proposalId: string, vote: boolean) => Promise<void>;
} => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const nfts = useRaisingNFTVaults();
    
    const getBuyNFTByProposal = useCallback((proposal: ProposalResponse): RaisingNFT | null => {
        const nft = nfts.find((nft) => proposal.msgs.some((msg) => msg.wasm?.execute.contract_addr === nft.buyContractAddress));
        return nft ?? null;
    }, [nfts.length]);

    const getVaultProposals = useCallback(async (icaMultisigAddress: string): Promise<readonly {
        nft: RaisingNFT;
        proposal: ProposalResponse;
    }[]> => {
        try {
            const proposalsData = await getProposals(
                abstraxionClient,
                icaMultisigAddress
            );

            const votersData = await getVoters(abstraxionClient, icaMultisigAddress);
            const thresholdData = await getMultisigThreshold(abstraxionClient, icaMultisigAddress);

            const buyNFTsByProposal = proposalsData?.proposals.reduce<{
                nft: RaisingNFT;
                proposal: ProposalResponse;
            }[]>((accm, proposal) => {
                const nft = getBuyNFTByProposal(proposal);
                return nft ? [...accm, { nft, proposal }] : accm;
            }, []);

            return buyNFTsByProposal;

        } catch(e) {
            console.log(e);
            return [];
        }

    }, [abstraxionClient, getBuyNFTByProposal]);

    useEffect(() => {
        //
    }, []);

    const voteProposal = useCallback(async (icaMultisigAddress: string, proposalId: string, vote: boolean) => {
        if (!address || address === '') {
            console.log('Account not found.');
            return;
        }

        await voteMultisigProposal(
          abstraxionClient,
          { bech32Address: address },
          icaMultisigAddress,
          proposalId,
          vote,
        );

      }, [abstraxionClient, address]);

    return {
        getVaultProposals,
        voteProposal,
    };
};

export default useProposals;