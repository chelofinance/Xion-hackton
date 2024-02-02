import { atom } from 'jotai';
import { LOCAL_STORAGE_KEYS, TokenSymbols } from '@/constants/app';
import type { ConnectedWallet } from '@/types/wallet';
import type { TokenData } from '@/data/types';
import apolloClients, { type AppApolloClients } from '@/data/graphql/apolloClients';

export const apolloClientsAtom = atom<AppApolloClients>(apolloClients);

/**
 *
 * @description token symbol is used as key atm; should be replaced with contract address
 */
export const allTokensDictAtom = atom<Record<TokenSymbols, TokenData>>({
  [TokenSymbols.INJ]: { logoURI: 'https://injective.talis.art/svg/icons/inj.svg' },
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
