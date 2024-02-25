import { MyVault, RaisingNFT } from "@/types/asset";
import { AllChains, ProposalStatus, TokenSymbols } from "./app";
import BigNumber from "bignumber.js";

export const MOCK_PROPOSALS: MyVault['proposals'] = [
    {
        nft: {
            chain: AllChains.INJECTIVE_TESTNET,
            participants: 0,
            raisedAmount: 0,
            collection: {
                contractAddress: 'cosmos1',
                collectionId: 'cosmos1',
                collectionName: 'Cosmos',
                createdByAddress: 'cosmos1',
                floorPrice: {
                    value: BigNumber(1000),
                    symbol: TokenSymbols.INJ,
                },
            },
            tokenId: '1',
            nftName: 'Cosmos 1',
            description: 'Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1',
            imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65cbca5d668ef30f99b23e51/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240225%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240225T000000Z&X-Amz-Expires=86400&X-Amz-Signature=b50884580258d4b899aee86e100ea5ce670773a25d98b59ec09ea45972115eec&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
            buyContractAddress: 'cosmos2',
            fixedPrice: {
                value: BigNumber(0.01),
                symbol: TokenSymbols.INJ,
            },
            ownerAddress: 'cosmos1',
            onSale: true,
        },
        proposal: {
            status: ProposalStatus.Passed,
            id: '1',
            title: 'Proposal 1',
            description: 'Proposal 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1Cosmos 1',
            msgs: [],
            threshold: 0,
            proposer: 'cosmos1',
            deposit: 0,
        },
    },
    {
        nft: {
            chain: AllChains.INJECTIVE_TESTNET,
            participants: 0,
            raisedAmount: 0,
            collection: {
                contractAddress: 'cosmos1',
                collectionId: 'cosmos1',
                collectionName: 'Cosmos',
                createdByAddress: 'cosmos1',
                floorPrice: {
                    value: BigNumber(1000),
                    symbol: TokenSymbols.INJ,
                },
            },
            tokenId: '1',
            nftName: 'Cosmos 1',
            description: 'Cosmos 1',
            imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65cbca5d668ef30f99b23e51/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240225%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240225T000000Z&X-Amz-Expires=86400&X-Amz-Signature=b50884580258d4b899aee86e100ea5ce670773a25d98b59ec09ea45972115eec&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
            buyContractAddress: 'cosmos2',
            fixedPrice: {
                value: BigNumber(0.01),
                symbol: TokenSymbols.INJ,
            },
            ownerAddress: 'cosmos1',
            onSale: true,
        },
        proposal: {
            status: ProposalStatus.Pending,
            id: '1',
            title: 'Proposal 1',
            description: 'Proposal 1',
            msgs: [],
            threshold: 0,
            proposer: 'cosmos1',
            deposit: 0,
        },
    },
    {
        nft: {
            chain: AllChains.INJECTIVE_TESTNET,
            participants: 0,
            raisedAmount: 0,
            collection: {
                contractAddress: 'cosmos1',
                collectionId: 'cosmos1',
                collectionName: 'Cosmos',
                createdByAddress: 'cosmos1',
                floorPrice: {
                    value: BigNumber(1000),
                    symbol: TokenSymbols.INJ,
                },
            },
            tokenId: '1',
            nftName: 'Cosmos 1',
            description: 'Cosmos 1',
            imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65cbca5d668ef30f99b23e51/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240225%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240225T000000Z&X-Amz-Expires=86400&X-Amz-Signature=b50884580258d4b899aee86e100ea5ce670773a25d98b59ec09ea45972115eec&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
            buyContractAddress: 'cosmos2',
            fixedPrice: {
                value: BigNumber(0.01),
                symbol: TokenSymbols.INJ,
            },
            ownerAddress: 'cosmos1',
            onSale: true,
        },
        proposal: {
            status: ProposalStatus.Rejected,
            id: '1',
            title: 'Proposal 1',
            description: 'Proposal 1',
            msgs: [],
            threshold: 0,
            proposer: 'cosmos1',
            deposit: 0,
        },
    },
]; 

export const MOCK_OWNED_NFTS: RaisingNFT[] = [
    {
        chain: AllChains.INJECTIVE_TESTNET,
        participants: 0,
        raisedAmount: 0,
        collection: {
            contractAddress: 'cosmos1',
            collectionId: 'cosmos1',
            collectionName: 'Cosmos',
            createdByAddress: 'cosmos1',
            floorPrice: {
                value: BigNumber(1000),
                symbol: TokenSymbols.INJ,
            },
        },
        tokenId: '1',
        nftName: 'Cosmos 1',
        description: 'Cosmos 1',
        imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65cbca5d668ef30f99b23e51/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240225%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240225T000000Z&X-Amz-Expires=86400&X-Amz-Signature=b50884580258d4b899aee86e100ea5ce670773a25d98b59ec09ea45972115eec&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
        buyContractAddress: 'cosmos2',
        fixedPrice: {
            value: BigNumber(0.01),
            symbol: TokenSymbols.INJ,
        },
        ownerAddress: 'cosmos1',
        onSale: true,
    },
    {
        chain: AllChains.INJECTIVE_TESTNET,
        participants: 0,
        raisedAmount: 0,
        collection: {
            contractAddress: 'cosmos1',
            collectionId: 'cosmos1',
            collectionName: 'Cosmos',
            createdByAddress: 'cosmos1',
            floorPrice: {
                value: BigNumber(1000),
                symbol: TokenSymbols.INJ,
            },
        },
        tokenId: '1',
        nftName: 'Cosmos 1',
        description: 'Cosmos 1',
        imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65cbca5d668ef30f99b23e51/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240225%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240225T000000Z&X-Amz-Expires=86400&X-Amz-Signature=b50884580258d4b899aee86e100ea5ce670773a25d98b59ec09ea45972115eec&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
        buyContractAddress: 'cosmos2',
        fixedPrice: {
            value: BigNumber(0.01),
            symbol: TokenSymbols.INJ,
        },
        ownerAddress: 'cosmos1',
        onSale: false,
    },
];