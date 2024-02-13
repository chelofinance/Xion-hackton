import { atom } from 'jotai';
import { LOCAL_STORAGE_KEYS, TokenSymbols } from '@/constants/app';
import type { ConnectedWallet } from '@/types/wallet';
import apolloClients, { type AppApolloClients } from '@/data/graphql/apolloClients';
import BURNT_LABS_LOGO_URL from '@/resources/logos/burnt_logo.svg';

type TokenData = {
  logoURI: string;
};

export const apolloClientsAtom = atom<AppApolloClients>(apolloClients);

/**
 *
 * @description token symbol is used as key atm; should be replaced with contract address
 */
export const allTokensDictAtom = atom<Record<TokenSymbols, TokenData>>({
  [TokenSymbols.INJ]: { logoURI: 'https://injective.talis.art/svg/icons/inj.svg' },
  [TokenSymbols.XION]: { logoURI: BURNT_LABS_LOGO_URL },
});

const userWalletAtomOrigin = atom<ConnectedWallet | null>(null);

export const userWalletAtom = atom(
  (get) => get(userWalletAtomOrigin),
  (_, set, userWallet: ConnectedWallet | null) => {
    set(userWalletAtomOrigin, userWallet);

    if (userWallet?.type) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_USED_WALLET, userWallet.type);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_USED_WALLET);
    }
  }
);

export const userAgentAtom = atom<
  { isMobile: boolean; isMobileOrTablet: boolean; isIOS: boolean; isNonIOSMobile: boolean } | undefined
>(undefined);
