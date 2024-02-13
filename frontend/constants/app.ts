import GoogleAnalytics from '@/analytics/googleAnalytics/GoogleAnalytics';
import Mixpanel from '@/analytics/mixpanel/Mixpanel';
// import ChainLogoOsmosis from "@/resources/logos/chain_logo_osmosis.png";
import XION_CHAIN_LOGO from "@/resources/logos/chain_logo_xion.png";
import type { NFTVault } from '@/types/asset';
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
};

export const SUPPORTED_CHAINS_DICT: Record<AppChains, { logoURL: string }> = {
  [AppChains.XION_TESTNET]: {
    logoURL: XION_CHAIN_LOGO.src,
  }
}

export const SUPPORTED_CHAINS: readonly AppChains[] = Object.values(AppChains);

export enum AllChains {
  XION_TESTNET = 'Xion Testnet',
  INJECTIVE_TESTNET = 'Injective Testnet',
}

export const CHAIN_METADATA_DICT: Record<AllChains, { explorerAddressURL: string }> = {
  [AllChains.XION_TESTNET]: {
    explorerAddressURL: '',
  },
  [AllChains.INJECTIVE_TESTNET]: {
    explorerAddressURL: '',
  }
}

export const chainConfigMap: Record<AppChains, ContractsDict> = {
  [AppChains.XION_TESTNET]: {
      cw3FixedMultisig: {
          codeId: 50
      },
      nomosFactory: {
          address: 'xion1jyrjanlg6mvna42rur559t8rcscrjfrayz4flasfymyvpzvkgefs9mnylc'
      },
      icaFactory: {
          address: 'xion1n7p3k5ffmj4upmfuhhak6yua5psfwcsh6ejevwh53s2nj8y8sg2sdexzp9'
      }
  }
}

export const abstraxionProviderConfig = { 
  contracts: [chainConfigMap[AppChains.XION_TESTNET].icaFactory.address],
 };

/**
 * 
 * @description the below types are tmp for wireframing
 */
export enum TokenSymbols {
  INJ = 'INJ',
  XION = 'XION',
}

export const PRICE_ORACLE_DICT: Record<TokenSymbols, number> = {
  [TokenSymbols.INJ]: 1.1,
  [TokenSymbols.XION]: 0.78,
}

export const FAKE_ABSTRAXION_ADDRESS = 'xion18104810481048104jfjkdfwofjk9280';

export const RAISING_NFT_VAULTS_DICT: Record<string, NFTVault> = {
  inj8x0x831k31lk31lkelklskdsldsdksldkslksll: {
    nftName: 'Monkey - 2004(WOOD)',
    description: 'We are destined to rule.',
    imgSrc: 'https://images.talis.art/tokens/6582d0be4a3988d286be0f9c/mediaThumbnail',
    contract: {
      address: 'inj8x0x831k31lk31lkelklskdsldsdksldkslksll',
    },
    floorPrice: {
      value: 1313133,
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 1111000,
    participants: 990,
    ica: {
      icaMultisigAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
      icaControllerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    },
    multisig: {
      voters: [
        {
          addr: FAKE_ABSTRAXION_ADDRESS,
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
  inj8x0x831k33191k31lkelklskdsldsdksldkslksll: {
    nftName: 'Injective Vandals #341',
    description: 'Vandals worldwide',
    imgSrc: 'https://images.talis.art/tokens/65a091fb10709e02588e13da/mediaThumbnail',
    contract: {
      address: 'inj8x0x831k33191k31lkelklskdsldsdksldkslksll',
    },
    floorPrice: {
      value: 13990,
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 200,
    participants: 22242,
    ica: {
      icaMultisigAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
      icaControllerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    },
    multisig: {
      voters: [
        {
          addr: FAKE_ABSTRAXION_ADDRESS,
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
  inj1019188104100101010101001100dksldkslksll: {
    nftName: 'Crypto Lady',
    description: 'PFP',
    imgSrc: 'https://talis-protocol.mo.cloudinary.net/inj/families/65b2e902e6b67bb48ef359fb/miniaturePicture',
    contract: {
      address: 'inj1019188104100101010101001100dksldkslksll',
    },
    floorPrice: {
      value: 1313133,
      symbol: TokenSymbols.INJ,
    },
    chain: AllChains.INJECTIVE_TESTNET,
    raisedAmount: 1111000,
    participants: 46,
    ica: {
      icaMultisigAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
      icaControllerAddress: 'injf1414o124802494hgdjfidhfdjfhqye01911881',
    },
    multisig: {
      voters: [
        {
          addr: FAKE_ABSTRAXION_ADDRESS,
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
  }
}
