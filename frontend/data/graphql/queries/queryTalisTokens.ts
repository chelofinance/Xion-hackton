import { gql } from "@apollo/client";

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
        }
    };
};

export type QueryTalisTokensParams = {
    input: TalisTokenInput;
}

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
}`;

export default QUERY_TALIS_TOKENS;

