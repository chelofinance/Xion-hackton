"use client";

import { useCallback } from 'react';
import { EventCategory } from '@/analytics/constants';
import useAnalytics from '@/hooks/useAnalytics';
import useProcessing from '@/hooks/useProcessing';
import type { Wallet } from '@/types/wallet';

const useConnect = () => {
  const { sendEvent, identify } = useAnalytics();
  const { target: connectingWallet, startProcessing: startConnecting, stopProcessing: stopConnecting } = useProcessing<Wallet>();

  const connect = useCallback(
    async (wallet: Wallet): Promise<Wallet | undefined> => {
      sendEvent(EventCategory.TRY_CONNECT_WALLET, `Try Connecting Wallet: ${wallet.name}`);

      const connector = "connector";

      if (!connector) {
        wallet.onNoConnector();
        sendEvent(EventCategory.FAIL_CONNECT_WALLET, `Fail to Connect Wallet - Uninstalled: ${wallet.name}`);
        return;
      }

      startConnecting(wallet);

      const account = "account";
      if (!account) {
        sendEvent(EventCategory.FAIL_CONNECT_WALLET, `Fail to Connect Wallet - No Account: ${wallet.name}`);
        stopConnecting();
        return;
      }

      stopConnecting();

      const address = wallet.name;
      identify(address); // change to unique address
      sendEvent(EventCategory.WALLET_CONNECTION, 'Connect Wallet', { address });

      return wallet;
    },
    [startConnecting, stopConnecting, sendEvent, identify]
  );

  return { connect, connectingWallet };
};

export default useConnect;
