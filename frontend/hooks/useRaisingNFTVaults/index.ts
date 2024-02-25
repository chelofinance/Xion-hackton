import {chainConfigMap, AppChains, AllChains, TokenSymbols} from '@/constants/app';
import QUERY_TALIS_TOKENS, {QueryTalisTokenResponse} from '@/data/graphql/queries/queryTalisTokens';
import {RaisingNFT} from '@/types/asset';
import {safeJsonParse} from '@/utils/text';
import {useQuery} from '@apollo/client';
import {getNetworkEndpoints, Network as InjectvieNetwork} from '@injectivelabs/networks';
import {ChainGrpcWasmApi} from '@injectivelabs/sdk-ts';
import BigNumber from 'bignumber.js';
import {useCallback, useEffect, useMemo, useState} from 'react';

const queryVariable = (collectionId: string, options?: {limit: number}) => ({
    input: {
        filter: {
            minter: {
                eq: collectionId,
            },
            id: {
                ne: collectionId,
            },
            privacy: {
                eq: 'public',
            },
        },
        sort: {
            _id: -1,
        },
        limit: options?.limit || 10,
        needCount: false,
    },
});

const useNftsOwners = (nfts: RaisingNFT[]) => {
    const [owners, setOwners] = useState<RaisingNFT[]>([]);
    const chainWasmApi = useMemo(() => {
        const endpoints = getNetworkEndpoints(InjectvieNetwork.Testnet);
        return new ChainGrpcWasmApi(endpoints.grpc);
    }, []);

    const decodeRes = (raw: Uint8Array): {owner: string} => {
        return safeJsonParse(atob(Buffer.from(raw).toString('base64')));
    };

    const update = useCallback(async () => {
        const ownersRes = await Promise.all(
            nfts.map((nft) =>
                chainWasmApi?.fetchSmartContractState(nft.collection.contractAddress, {owner_of: {token_id: nft.tokenId}})
            )
        );
        setOwners(
            ownersRes.map(
                (res, i) =>
                ({
                    ...nfts[i],
                    ownerAddress: decodeRes(res.data).owner || nfts[i].ownerAddress,
                } as RaisingNFT)
            )
        );
    }, [nfts, chainWasmApi]);

    useEffect(() => {
        update();
    }, [update]);

    return {withOwners: owners, update};
};

const useRaisingNFTVaults = (collectionId: string = chainConfigMap[AppChains.XION_TESTNET].nfts.collectionId): RaisingNFT[] => {
    const {loading, error, data} = useQuery<QueryTalisTokenResponse>(QUERY_TALIS_TOKENS, {
        variables: queryVariable(collectionId),
    });

    const info = useMemo(
        () =>
            loading
                ? {tokens: {tokens: []}}
                : Boolean(error)
                    ? {tokens: {tokens: []}}
                    : (data as QueryTalisTokenResponse),
        [loading, error, data]
    );

    const nfts = useMemo(() => {
        return info.tokens.tokens.map(
            (tkn, i): RaisingNFT => ({
                chain: AllChains.INJECTIVE_TESTNET,
                participants: 0,
                raisedAmount: 0,
                collection: {
                    collectionId: tkn.family.collection_id,
                    collectionName: tkn.family.name,
                    createdByAddress: tkn.minter.wallet.injAddress,
                    contractAddress: tkn.family.collection_id,
                    floorPrice: {
                        value: BigNumber(tkn.onChainInfo.sellOrderInfo?.order.price.native[0].amount || 0),
                        symbol: TokenSymbols.INJ,
                    },
                },
                tokenId: tkn.token_id,
                nftName: tkn.title,
                description: tkn.description,
                imgSrc: tkn.mediaThumbnail,
                fixedPrice: {
                    value: BigNumber(tkn.onChainInfo.sellOrderInfo?.order.price.native[0].amount || 0),
                    symbol: TokenSymbols.INJ,
                },
                ownerAddress: '',
                buyContractAddress: tkn.onChainInfo.sellOrderInfo?.order.contract_address || '',
                onSale: tkn.onSale,
            })
        );
    }, [info]);

    const {withOwners} = useNftsOwners(nfts);

    return withOwners;
};

export default useRaisingNFTVaults;
