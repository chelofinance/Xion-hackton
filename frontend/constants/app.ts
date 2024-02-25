import GoogleAnalytics from '@/analytics/googleAnalytics/GoogleAnalytics';
import Mixpanel from '@/analytics/mixpanel/Mixpanel';
import XION_CHAIN_LOGO from '@/resources/logos/chain_logo_xion.png';
import type {NFTVault, RaisingNFT} from '@/types/asset';
import {ChannelInitOptions} from '@/types/channel';
import {ContractsDict} from '@/types/contract';
import BigNumber from 'bignumber.js';

export const googleAnalytics = new GoogleAnalytics('google analytics');
export const mixpanel = new Mixpanel('mixpanel');

export const FORMAT_LOCALE_FALLBACK = 'en';

export const MAX_DECIMALS = 18;

export const COMPACT_DECIMALS = 4;

export const LOCAL_STORAGE_KEYS = {
  LAST_USED_WALLET: 'user_last_used_wallet',
};

export const TITLES = {
  HOME: ['Finance', 'Effortless', 'All hours'],
};

export const TEXTS = {
  NO_DATA: 'No data found',
};

export const IS_DEV = process.env.NODE_ENV === 'development';

/**
 *
 * @description supported chains and contracts map
 */
export enum AppChains {
  XION_TESTNET = 'xion-testnet',
}

export const SUPPORTED_CHAINS_DICT: Record<AppChains, {logoURL: string}> = {
  [AppChains.XION_TESTNET]: {
    logoURL: XION_CHAIN_LOGO.src,
  },
};

export const SUPPORTED_CHAINS: readonly AppChains[] = Object.values(AppChains);

export enum AllChains {
  XION_TESTNET = 'Xion Testnet',
  INJECTIVE_TESTNET = 'Injective Testnet',
}

export const CHAIN_METADATA_DICT: Record<AllChains, {explorerAddressURL: string}> = {
  [AllChains.XION_TESTNET]: {
    explorerAddressURL: '',
  },
  [AllChains.INJECTIVE_TESTNET]: {
    explorerAddressURL: 'https://testnet.explorer.injective.network',
  },
};

export const chainConfigMap: Record<AppChains, ContractsDict> = {
  [AppChains.XION_TESTNET]: {
    nfts: {
      collectionId: '65ca322f3e56373c6b5d1a66',
    },
    cw3FixedMultisig: {
      codeId: '282',
    },
    icaFactory: {
      address: 'xion134v97d8xu7hwuu6h33s0049yz8ju7254q32amlx5qfmngygpsk8q3hlp98',
    },
    proxyMultisig: {
      address: 'xion1fcw3u2yslyszdaamvz3dea2jyhwhxlyuz5euujpzvrra9awdk6lqwdtcwd',
    },
  },
};

export const channelOpenInitOptions: Record<AppChains, ChannelInitOptions> = {
  [AppChains.XION_TESTNET]: {
    connectionId: 'connection-43',
    counterpartyConnectionId: 'connection-211',
  },
};

export const XION_RPC = 'https://testnet-rpc.xion-api.com:443';

export const abstraxionProviderConfig = {
  contracts: [
    chainConfigMap[AppChains.XION_TESTNET].icaFactory.address,
    chainConfigMap[AppChains.XION_TESTNET].proxyMultisig.address,
  ],
  // rpcUrl: XION_RPC,
};

export const INJECTIVE_RPC = 'https://testnet.sentry.tm.injective.network:443';
export const INJECTIVE_ID = 'injective-888';

/**
 *
 * @description the below types are tmp for wireframing
 */
export enum TokenSymbols {
  INJ = 'INJ',
  XION = 'XION',
}

export type CoinData = {denomOn: Record<AllChains, string>; decimals: number};

export const COIN_DICT: Record<TokenSymbols, CoinData> = {
  [TokenSymbols.INJ]: {
    denomOn: {
      [AllChains.INJECTIVE_TESTNET]: 'inj',
      [AllChains.XION_TESTNET]: 'ibc/0166AE2224341A3F70943E315DAC6EDF012A638D0F9358794FF7525BA1DFC191',
    },
    decimals: 18,
  },
  [TokenSymbols.XION]: {
    denomOn: {
      [AllChains.INJECTIVE_TESTNET]: 'ibc/6AB81EFD48DC233A206FAD0FB6F2691A456246C4A7F98D0CD37E2853DD0493EA',
      [AllChains.XION_TESTNET]: 'uxion',
    },
    decimals: 6,
  },
};

export const PRICE_ORACLE_DICT: Record<TokenSymbols, number> = {
  [TokenSymbols.INJ]: 35,
  [TokenSymbols.XION]: 1,
};

export const RAISING_NFTS: readonly RaisingNFT[] = [
  {
    collection: {
      collectionId: '65ca32d33e56373c6b5d1f95',
      collectionName: 'Nomos',
      contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
      createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
      floorPrice: {
        value: BigNumber(0.01),
        symbol: TokenSymbols.INJ,
      },
    },
    tokenId: '1',
    nftName: 'Nomos 1',
    description: 'A real crosschain solutsion',
    imgSrc:
      'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33023e56373c6b5d1fb5/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=0217d2572c4d1f9d657392b8234601f629d15fbd31b09e90f0cef9169cd2265b&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
    // contract: {
    //   address: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
    // },
    ownerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
    fixedPrice: {
      value: BigNumber(0.01),
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 0.01,
    participants: 3,
    onSale: true,
  },
  {
    collection: {
      collectionId: '65ca32d33e56373c6b5d1f95',
      collectionName: 'Nomos',
      contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
      createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
      floorPrice: {
        value: BigNumber(0.01),
        symbol: TokenSymbols.INJ,
      },
    },
    tokenId: '2',
    nftName: 'Nomos 2',
    description: 'A real crosschain solutsion',
    imgSrc:
      'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33423e56373c6b5d2007/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=f30d63bd6c4e5c64fb2f0b7992729c69ce268ecdefac96569c0b1c20c33ac0e5&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
    ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
    buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
    fixedPrice: {
      value: BigNumber(0.01),
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 0.01,
    participants: 3,
    onSale: true,
  },
  {
    collection: {
      collectionId: '65ca32d33e56373c6b5d1f95',
      collectionName: 'Nomos',
      contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
      createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
      floorPrice: {
        value: BigNumber(0.01),
        symbol: TokenSymbols.INJ,
      },
    },
    tokenId: '3',
    nftName: 'Nomos 3',
    description: 'A real crosschain solutsion',
    imgSrc:
      'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33723e56373c6b5d2088/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=d3247b89264ae0d83ee3a7f6df69c18c94d540c81d0179437cd1614eeacdd104&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
    ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
    buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
    fixedPrice: {
      value: BigNumber(0.01),
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 0.007,
    participants: 3,
    onSale: true,
  },
];

export const RAISING_NFTS_DICT: Record<string, RaisingNFT> = {
  inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc741: {
    ...RAISING_NFTS[0],
  },
  inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc742: {
    ...RAISING_NFTS[1],
  },
  inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc743: {
    ...RAISING_NFTS[2],
  },
};

export enum ProposalStatus {
  Pending = 'pending',
  Open = 'open',
  Rejected = 'rejected',
  Passed = 'passed',
  Executed = 'executed',
}

export const PROPOSAL_STATUS_LABEL_DICT: Record<ProposalStatus, string> = {
  [ProposalStatus.Pending]: 'Pending',
  [ProposalStatus.Open]: 'Open',
  [ProposalStatus.Rejected]: 'Rejected',
  [ProposalStatus.Passed]: 'Passed',
  [ProposalStatus.Executed]: 'Executed',
};

// Due to unstable relayers, ICA Account address could be empty when creating a proposal.
// So, to avoid errors in demo, we use a placeholder address.
export const INJ_ICA_ACCOUNT_PLACEHOLDER = 'inj1r8x942pe0sf7dd9cpr36szzaflpleav5qx59ke';
export const ICA_CONTROLLER_FALLBACK = 'xion1az60z73mezhcyxajgucvlcs3kj72fzwu2l2m5qxmsccs6vmnappqys5pjj';
