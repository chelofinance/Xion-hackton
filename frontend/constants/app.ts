import GoogleAnalytics from '@/analytics/googleAnalytics/GoogleAnalytics';
import Mixpanel from '@/analytics/mixpanel/Mixpanel';
import XION_CHAIN_LOGO from "@/resources/logos/chain_logo_xion.png";
import type { NFTVault, RaisingNFT } from '@/types/asset';
import { ContractsDict } from '@/types/contract';

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
  }
}

export const chainConfigMap: Record<AppChains, ContractsDict> = {
  [AppChains.XION_TESTNET]: {
    cw3FixedMultisig: {
      codeId: 50,
      address: 'xion105h6k7cv3kvt4vxeh5l86x9wnqudjl8wlx87ywwqzqcpa24m6fzsc4d2y0', //placeholder addr
    },
    icaController: {
      address: 'xion1az60z73mezhcyxajgucvlcs3kj72fzwu2l2m5qxmsccs6vmnappqys5pjj',
    },
    icaAccount: {
      address: 'inj1tfvcvjkpw02eeldx2lhtw0xysg3msehyarqe5lwygf3dk40vt9uqhuzlg3',
    },
    nomosFactory: {
      address: 'xion1qmjxqd2j3vgcjrc9ea70qae2rkf28tced4sv50twmuxshzrxyfsq7saj9e',
    },
    icaFactory: {
      address: 'xion1qmjxqd2j3vgcjrc9ea70qae2rkf28tced4sv50twmuxshzrxyfsq7saj9e',
    },
  },
};

export const abstraxionProviderConfig = {
  contracts: [
    chainConfigMap[AppChains.XION_TESTNET].icaFactory.address,
    chainConfigMap[AppChains.XION_TESTNET].cw3FixedMultisig.address,
  ],
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

export const PRICE_ORACLE_DICT: Record<TokenSymbols, number> = {
  [TokenSymbols.INJ]: 35,
  [TokenSymbols.XION]: 1,
}

export const FAKE_ABSTRAXION_ADDRESS = 'xion18104810481048104jfjkdfwofjk9280';

// export const RAISING_NFT_VAULTS_DICT: Record<string, RaisingNFT> = {
//   inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc741: {
//     collection: {
//       collectionId: '65ca32d33e56373c6b5d1f95',
//       collectionName: 'Nomos',
//       contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
//       createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
//       floorPrice: {
//         value: 0.01,
//         symbol: TokenSymbols.INJ,
//       },
//     },
//     tokenId: '1',
//     nftName: 'Nomos 1',
//     description: 'A real crosschain solutsion',
//     imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33023e56373c6b5d1fb5/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=0217d2572c4d1f9d657392b8234601f629d15fbd31b09e90f0cef9169cd2265b&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
//     // contract: {
//     //   address: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
//     // },
//     ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
//     buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
//     fixedPrice: {
//       value: 0.01,
//       symbol: TokenSymbols.INJ,
//     },
//     chain: AllChains.INJECTIVE_TESTNET,
//     raisedAmount: 0.005,
//     participants: 10,
//   },
//   inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc742: {
//     collection: {
//       collectionId: '65ca32d33e56373c6b5d1f95',
//       collectionName: 'Nomos',
//       contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
//       createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
//       floorPrice: {
//         value: 0.01,
//         symbol: TokenSymbols.INJ,
//       },
//     },
//     tokenId: '2',
//     nftName: 'Nomos 2',
//     description: 'A real crosschain solutsion',
//     imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33423e56373c6b5d2007/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=f30d63bd6c4e5c64fb2f0b7992729c69ce268ecdefac96569c0b1c20c33ac0e5&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
//     ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
//     buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
//     fixedPrice: {
//       value: 0.01,
//       symbol: TokenSymbols.INJ,
//     },
//     chain: AllChains.INJECTIVE_TESTNET,
//     raisedAmount: 0.01,
//     participants: 3,
//   },
//   inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc743: {
//     collection: {
//       collectionId: '65ca32d33e56373c6b5d1f95',
//       collectionName: 'Nomos',
//       contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
//       createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
//       floorPrice: {
//         value: 0.01,
//         symbol: TokenSymbols.INJ,
//       },
//     },
//     tokenId: '3',
//     nftName: 'Nomos 3',
//     description: 'A real crosschain solutsion',
//     imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33723e56373c6b5d2088/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=d3247b89264ae0d83ee3a7f6df69c18c94d540c81d0179437cd1614eeacdd104&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
//     ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
//     buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
//     fixedPrice: {
//       value: 0.01,
//       symbol: TokenSymbols.INJ,
//     },
//     chain: AllChains.INJECTIVE_TESTNET,
//     raisedAmount: 0.007,
//     participants: 3,
//   }
// }

export const NFT_VAULTS_DICT: Record<string, NFTVault> = {
  inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc741: {
    collection: {
      collectionId: '65ca32d33e56373c6b5d1f95',
      collectionName: 'Nomos',
      contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
      createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
      floorPrice: {
        value: 0.01,
        symbol: TokenSymbols.INJ,
      },
    },
    tokenId: '1',
    nftName: 'Nomos 1',
    description: 'A real crosschain solutsion',
    imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33023e56373c6b5d1fb5/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=0217d2572c4d1f9d657392b8234601f629d15fbd31b09e90f0cef9169cd2265b&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
    // contract: {
    //   address: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
    // },
    ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
    buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
    fixedPrice: {
      value: 0.01,
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 0.001,
    participants: 3,
    ica: {
      icaMultisigAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
      icaControllerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    },
    multisig: {
      voters: [
        {
          addr: 'xion14710481048488481084fdjkfjdkl',
          weight: 1,
          share: 0.15,
        },
        {
          addr: 'xionwf1kf8080f2fjdkflskfdlsdkflskdsl',
          weight: 1,
          share: 0.4,
        },
      ],
      govThreshold: 0.8,
    },
  },
  inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc742: {
    collection: {
      collectionId: '65ca32d33e56373c6b5d1f95',
      collectionName: 'Nomos',
      contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
      createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
      floorPrice: {
        value: 0.01,
        symbol: TokenSymbols.INJ,
      },
    },
    tokenId: '2',
    nftName: 'Nomos 2',
    description: 'A real crosschain solutsion',
    imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33423e56373c6b5d2007/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=f30d63bd6c4e5c64fb2f0b7992729c69ce268ecdefac96569c0b1c20c33ac0e5&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
    ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
    buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
    fixedPrice: {
      value: 0.01,
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 0.01,
    participants: 3,
    ica: {
      icaMultisigAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
      icaControllerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    },
    multisig: {
      voters: [
        {
          addr: 'xion1vmk42e8fjzdqxjvkrz9gdcxxp4xpxhey6f03xykfqzw0mqxwy4qs8lr8mn',
          weight: 1,
          share: 0.2,
        }, 
        {
          addr: 'xion1mg6m7kqmnc4ecx7grhm4mj2wvzdm44v3p5k8sn4p3qc2q8cda2uq4jcmt8',
          weight: 1,
          share: 0.45,
        },
        {
          addr: 'xion14710481048488481084fdjkfjdkl',
          weight: 1,
          share: 0.15,
        },
        {
          addr: 'xionwf1kf8080f2fjdkflskfdlsdkflskdsl',
          weight: 1,
          share: 0.4,
        },
      ],
      govThreshold: 0.8,
    },
  },
  inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc743: {
    collection: {
      collectionId: '65ca32d33e56373c6b5d1f95',
      collectionName: 'Nomos',
      contractAddress: 'inj1m6spa200qevzfnrt9ca2ez5dgmd7725l0ruc74',
      createdByAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
      floorPrice: {
        value: 0.01,
        symbol: TokenSymbols.INJ,
      },
    },
    tokenId: '3',
    nftName: 'Nomos 3',
    description: 'A real crosschain solutsion',
    imgSrc: 'https://talis-app-injective-staging.s3.eu-west-2.amazonaws.com/tokens/65ca33723e56373c6b5d2088/mediaThumbnail?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARORJINLQJAF6N2GU%2F20240214%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240214T000000Z&X-Amz-Expires=86400&X-Amz-Signature=d3247b89264ae0d83ee3a7f6df69c18c94d540c81d0179437cd1614eeacdd104&X-Amz-SignedHeaders=host&response-cache-control=public%2C%20max-age%3D86400%2C%20immutable&x-id=GetObject',
    ownerAddress: 'inj1p9jgmcs9hefl39u3qwrkhr2vqcv89383sekapq',
    buyContractAddress: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
    fixedPrice: {
      value: 0.01,
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 0.007,
    participants: 3,
    ica: {
      icaMultisigAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
      icaControllerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    },
    multisig: {
      voters: [
        {
          addr: 'xion1vmk42e8fjzdqxjvkrz9gdcxxp4xpxhey6f03xykfqzw0mqxwy4qs8lr8mn',
          weight: 1,
          share: 0.2,
        }, 
        {
          addr: 'xion1mg6m7kqmnc4ecx7grhm4mj2wvzdm44v3p5k8sn4p3qc2q8cda2uq4jcmt8',
          weight: 1,
          share: 0.45,
        },
        {
          addr: 'xion14710481048488481084fdjkfjdkl',
          weight: 1,
          share: 0.15,
        },
        {
          addr: 'xionwf1kf8080f2fjdkflskfdlsdkflskdsl',
          weight: 1,
          share: 0.4,
        },
      ],
      govThreshold: 0.8,
    },
  },
};
