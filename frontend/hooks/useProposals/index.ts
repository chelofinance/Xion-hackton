import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProposalList, voteProposal as voteMultisigProposal } from "@/utils/multisig";

type ProposalStatus = 'Approved' | 'Rejected' | 'Pending';
type Proposal = {
    id: string;
    description: string;
    status: ProposalStatus;
}

const TEST_PROPOSALS: Proposal[] = [
    {
        id: '1',
        description: 'buy this NFT',
        status: 'Approved'
    },
    {
        id: '2',
        description: 'sell this NFT',
        status: 'Pending'
    },
];

const useProposals = (icaMultisigAddress: string): { 
    proposals: Proposal[]; 
    updateProposals: () => Promise<void>;
    voteProposal:(proposalId: string, vote: boolean) => Promise<void>;
} => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();
  const { data: account } = useAbstraxionAccount();


    const [proposals, setProposals] = useState<Proposal[]>([]);

    const updateProposals = useCallback(async () => {
        try {
            const fetchedProposalData: { proposals: Proposal[] } | undefined = await getProposalList(
                abstraxionClient,
                icaMultisigAddress
            );

            setProposals(fetchedProposalData?.proposals ?? []);
        } catch(e) {
            console.log(e);
        }

    }, [abstraxionClient, icaMultisigAddress]);

    useEffect(() => {
        updateProposals();
    }, [updateProposals]);

    const voteProposal = useCallback(async (proposalId: string, vote: boolean) => {
        await voteMultisigProposal(
          abstraxionClient,
          account,
          icaMultisigAddress,
          proposalId,
          vote,
        );

        await updateProposals();
      }, [abstraxionClient, account, icaMultisigAddress, updateProposals]);

    return {
        proposals,
        updateProposals,
        voteProposal,
    };
};

export default useProposals;