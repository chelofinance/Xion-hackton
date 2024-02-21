import {RAISING_NFTS, chainConfigMap, AppChains, AllChains, TokenSymbols, COIN_DICT} from '@/constants/app';
import QUERY_TALIS_TOKENS, {QueryTalisTokenResponse} from '@/data/graphql/queries/queryTalisTokens';
import {RaisingNFT} from '@/types/asset';
import {useQuery} from '@apollo/client';
import BigNumber from 'bignumber.js';

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

const useRaisingNFTVaults = (collectionId: string = chainConfigMap[AppChains.XION_TESTNET].nfts.collectionId): RaisingNFT[] => {
    const {loading, error, data} = useQuery<QueryTalisTokenResponse>(QUERY_TALIS_TOKENS, {
        variables: queryVariable(collectionId),
    });
    const info = loading
        ? {tokens: {tokens: []}}
        : Boolean(error)
            ? {tokens: {tokens: []}}
            : (data as QueryTalisTokenResponse);

    const nfts: RaisingNFT[] = info.tokens.tokens.map(
        (tkn): RaisingNFT => ({
            chain: AllChains.XION_TESTNET,
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
            ownerAddress: tkn.owner.wallet.injAddress,
            buyContractAddress: tkn.onChainInfo.sellOrderInfo?.order.contract_address || '',
            onSale: tkn.onSale,
        })
    );
    console.log({nfts});

    return nfts;
};

export default useRaisingNFTVaults;
