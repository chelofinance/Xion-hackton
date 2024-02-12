"use client";

import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { EventCategory } from '@/analytics/constants';
import useAnalytics from '@/hooks/useAnalytics';
import useProcessing from '@/hooks/useProcessing';
import type { ConnectedWallet, Wallet } from '@/types/wallet';
import useWallets from './useWallets';
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';
import useModal from '@/hooks/useModal';
import type { Account } from '@cosmjs/stargate';

const XionWalletConnectOverlay = lazy(() => import('@/components/overlays/XionWalletConnectOverlay'));

type ConnectingWallet = Wallet & { account: Account | null };

const useConnectAbstraxion = () => {
  // const [connectingWallet, setConnectingWallet] = useState<ConnectingWallet | null>(null);

  const { abstraxion } = useWallets();
  const { data: xionAccount, isConnected: isXionAcccountConnected } = useAbstraxionAccount();
  const { client: abstraxionClient } = useAbstraxionSigningClient();

  const getAbstraxionAccountFrom = useCallback(async (bech32Address: string): Promise<Account | null> => {
      const abstractAccount = await abstraxionClient?.getAccount(bech32Address);
      return abstractAccount ?? null;
  }, [abstraxionClient]);

  const getConnectingWallet = useCallback(async (): Promise<ConnectingWallet | null> => {
    if (isXionAcccountConnected) {
      const account = await getAbstraxionAccountFrom(xionAccount.bech32Address);
      return { ...abstraxion, account };
    } else {
      return null;
    }
  }, [getAbstraxionAccountFrom, xionAccount.bech32Address, isXionAcccountConnected]);

  const abstraxionModal = useModal();

  const openConnectModal = useCallback(async () => {
    await abstraxionModal.open((props) => (
      <Suspense>
        <XionWalletConnectOverlay id={abstraxionModal.id} {...props} />
      </Suspense>
    ));
  }, [abstraxionModal]);

  const connect = async (): Promise<ConnectingWallet | null> => {
    const wallet = await getConnectingWallet();
    if (wallet !== null) return wallet;

    await openConnectModal();

    const connectingWallet = await getConnectingWallet();
    console.log('connectingWallet', connectingWallet);
    return connectingWallet;
  };

  return { connect };
};

/**
 * 
 * @description useConnect hook
 */
const useConnect = () => {
  const { sendEvent, identify } = useAnalytics();
  const { target, startProcessing: startConnecting, stopProcessing: stopConnecting } = useProcessing<Wallet>();

  const [userWallet, setUserWallet] = useAtom(userWalletAtom);

  const { connect: connectAbstraxion } = useConnectAbstraxion();

  const connect = useCallback(
    async (wallet: Wallet): Promise<ConnectedWallet | undefined> => {
      sendEvent(EventCategory.TRY_CONNECT_WALLET, `Try Connecting Wallet: ${wallet.name}`);

      startConnecting(wallet);

      const connectingWallet = wallet.type === 'abstraxion' ? await connectAbstraxion() : null;

      if (connectingWallet === null) {
        sendEvent(EventCategory.FAIL_CONNECT_WALLET, `Fail to Connect Wallet: ${wallet.name}`);
        stopConnecting();
        return;
      }

      const account = connectingWallet.account;
      if (account === null) {
        sendEvent(EventCategory.FAIL_CONNECT_WALLET, `Fail to Connect Wallet - No Account: ${wallet.name}`);
        stopConnecting();
        return;
      }

      const connectedWallet: ConnectedWallet = { ...connectingWallet, account };
      setUserWallet(connectedWallet);

      stopConnecting();

      identify(connectedWallet.account.address); // change to unique address
      sendEvent(EventCategory.WALLET_CONNECTION, 'Connect Wallet', { address: connectedWallet.account.address });

      return connectedWallet;
    },
    [userWallet, startConnecting, stopConnecting, sendEvent, identify]
  );

  return { connect, connectingWallet: target };
};

export default useConnect;
