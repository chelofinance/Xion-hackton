import {useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {useCallback, useEffect} from 'react';
import {voteProposal as voteMultisigProposal} from '@/utils/multisig';
import {ProposalStatus} from '@/constants/app';
import {ProposalResponse, getMultisigThreshold, getProposals, getVoters} from '@/utils/xion';
import useRaisingNFTVaults from '../useRaisingNFTVaults';
import {RaisingNFT} from '@/types/asset';
import {decodeBase64, safeJsonParse} from '@/utils/text';
import {registry} from '@/utils/propose';
import {CosmwasmWasmV1Tx} from '@injectivelabs/core-proto-ts';

type Proposal = {
    id: string;
    description: string;
    status: ProposalStatus;
};

type UseProposals = {
    getVaultProposals: (icaMultisigAddress: string) => Promise<
        readonly {
            nft: RaisingNFT;
            proposal: ProposalResponse;
        }[]
    >;
    voteProposal: (icaMultisigAddress: string, proposalId: string, vote: boolean) => Promise<void>;
};

type DecodedMessages = {
    send_cosmos_msgs: {
        messages: {
            stargate: {
                type_url: string;
                value: string;
            };
        }[];
        packet_memo: string;
    };
};

const useProposals = (address: string | undefined): UseProposals => {
    const {client: abstraxionClient} = useAbstraxionSigningClient();

    const nfts = useRaisingNFTVaults();

    const getBuyNFTByProposal = useCallback(
        (proposal: ProposalResponse): RaisingNFT | null => {
            const nft = nfts.find((nft) => {
                const decodedMessages = proposal.msgs
                    .map((msg) => decodeBase64(msg.wasm?.execute.msg) as DecodedMessages | null)
                    .filter(Boolean);
                const stargate = decodedMessages.map((msg) => msg?.send_cosmos_msgs.messages[0].stargate).filter(Boolean) as {
                    type_url: string;
                    value: string;
                }[];

                const stargateValues = stargate.map((str) => ({
                    type_url: str.type_url,
                    value: new Uint8Array(Buffer.from(str.value, 'base64')),
                }));
                const protobufMsg = stargateValues.find((val) => {
                    try {
                        registry.decode({typeUrl: val.type_url, value: val.value});
                        return true;
                    } catch (err) {
                        return false;
                    }
                });

                if (!protobufMsg) return null;

                const msgExecuteBuy = registry.decode({
                    typeUrl: protobufMsg.type_url,
                    value: protobufMsg.value,
                }) as CosmwasmWasmV1Tx.MsgExecuteContract;
                const nftCall = safeJsonParse(atob(Buffer.from(msgExecuteBuy.msg).toString('base64')));

                return nftCall && nftCall.buy_token.token_id === nft.tokenId;
            });
            return nft ?? null;
        },
        [nfts.length]
    );

    const getVaultProposals = useCallback(
        async (
            icaMultisigAddress: string
        ): Promise<
            readonly {
                nft: RaisingNFT;
                proposal: ProposalResponse;
            }[]
        > => {
            try {
                const proposalsData = await getProposals(abstraxionClient, icaMultisigAddress);
                //const votersData = await getVoters(abstraxionClient, icaMultisigAddress);
                //const thresholdData = await getMultisigThreshold(abstraxionClient, icaMultisigAddress);

                const buyNFTsByProposal = proposalsData?.proposals.reduce<
                    {
                        nft: RaisingNFT;
                        proposal: ProposalResponse;
                    }[]
                >((accm, proposal) => {
                    const nft = getBuyNFTByProposal(proposal);
                    return nft ? [...accm, {nft, proposal}] : accm;
                }, []);

                return buyNFTsByProposal;
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        [abstraxionClient, getBuyNFTByProposal]
    );

    useEffect(() => {
        //
    }, []);

    const voteProposal = useCallback(
        async (icaMultisigAddress: string, proposalId: string, vote: boolean) => {
            if (!address || address === '') {
                console.log('Account not found.');
                return;
            }

            await voteMultisigProposal(abstraxionClient, {bech32Address: address}, icaMultisigAddress, proposalId, vote);
        },
        [abstraxionClient, address]
    );

    return {
        getVaultProposals,
        voteProposal,
    };
};

export default useProposals;
