import GoogleAnalytics from '@/analytics/googleAnalytics/GoogleAnalytics';
import Mixpanel from '@/analytics/mixpanel/Mixpanel';
import ChainLogoOsmosis from "@/resources/logos/chain_logo_osmosis.png";
import ChainLogoXion from "@/resources/logos/chain_logo_xion.png";
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
export enum SupportedChains {
  XION_TESTNET = 'xion-testnet',
};

export enum AllChains {
  INJECTIVE_TESTNET = 'Injective Testnet',
}

export const chainConfigMap: Record<SupportedChains, ContractsDict> = {
  [SupportedChains.XION_TESTNET]: {
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
  contracts: [chainConfigMap[SupportedChains.XION_TESTNET].icaFactory.address],
 };

/**
 * 
 * @description the below types are tmp for wireframing
 */
export enum TokenSymbols {
  INJ = 'INJ',
}

export type SupportedChain = {
  logoURL?: string;
  name: string;
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  {
      name: 'All chains',
  },
  {
      logoURL: ChainLogoOsmosis.src,
      name: 'Osmosis',
  },
  {
      logoURL: ChainLogoXion.src,
      name: 'Xion',
  }
];
