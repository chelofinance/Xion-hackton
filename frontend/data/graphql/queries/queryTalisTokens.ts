import {gql} from '@apollo/client';

type TalisTokenInput = {
    limit: number;
    offset: number;
    sort: {
        price: number;
    };
    filter?: {
        privacy: {
            eq: 'public';
        };
        onSale: {
            eq: boolean;
        };
        isNsfw: {
            eq: boolean;
        };
        auction_id: {
            ge: number;
        };
        auctionEndTimestamp: {
            ge: number;
        };
    };
};

export type QueryTalisTokensParams = {
    input: TalisTokenInput;
};

export type QueryTalisTokenResponse = {
    tokens: {
        count: number;
        tokens: {
            id: string;
            token_id: string;
            isMinterArtist: boolean;
            isCollectionBlocked: boolean;
            auction_id: number;
            media: string;
            mediaType: string;
            mediaThumbnail: string;
            title: string;
            description: string;
            onSale: boolean;
            price: string;
            askedCurrency: 'inj';
            env: 'testnet';
            chain: 'injective';
            privacy: 'public';
            owner: {
                id: string;
                wallet: {
                    injAddress: string;
                };
            };
            minter: {
                id: string;
                username: string | null;
                wallet: {
                    injAddress: string;
                };
            };
            thumbnailDimensions: {
                width: number;
                height: number;
            };
            family: {
                id: string;
                name: string;
                collection_id: string;
            };
            onChainInfo: {
                ownerInfo: {
                    owner: string;
                };
                sellOrderInfo?: {
                    order: {
                        class_id: 'injective';
                        token_id: string;
                        price: {
                            native: {
                                denom: string;
                                amount: string;
                            }[];
                        };
                        owner: string;
                        contract_address: string;
                    };
                };
            };
            createdAt: number;
            updatedAt: number;
        }[];
    };
};

const QUERY_TALIS_TOKENS = gql`
    query GetTokens($input: TokensInput!) {
        tokens(input: $input) {
            tokens {
                id
                token_id
                isMinterArtist
                isCollectionBlocked
                auction_id
                auctionEndTimestamp
                category
                media
                mediaType
                mediaThumbnail
                metadata2
                title
                description
                royalty
                isCollectionGeneric
                metadata
                onSale
                price
                askedCurrency
                env
                chain
                privacy
                hasBeenSoldAlready
                isCharity
                isNsfw
                likesCount
                hasRevealed
                owner {
                    id
                    terraAddress
                    wallet {
                        injAddress
                        __typename
                    }
                    __typename
                }
                minter {
                    id
                    terraAddress
                    username
                    isArtist
                    wallet {
                        injAddress
                        __typename
                    }
                    profilePic
                    __typename
                }
                rarity {
                    score
                    rank
                    __typename
                }
                thumbnailDimensions {
                    width
                    height
                    __typename
                }
                family {
                    id
                    name
                    collection_id
                    isExternal
                    hasReveal
                    isBadge
                    badgeUri
                    badgePicture
                    hasBeenWhitelisted
                    __typename
                }
                tags {
                    id
                    name
                    __typename
                }
                onChainInfo {
                    ownerInfo
                    sellOrderInfo
                    auctionInfo
                    royaltyInfo
                    __typename
                }
                createdAt
                updatedAt
                __typename
            }
            count
            __typename
        }
    }
`;

export default QUERY_TALIS_TOKENS;
