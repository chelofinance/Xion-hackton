import { ConnectedWallet } from "@/types/wallet";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import type { Coin } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";

const useBalance = (wallet: ConnectedWallet): Coin | null => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const [balance, setBalance] = useState<Coin | null>(null);

    const updateAbstraxionBalance = useCallback(async (denom = 'uxion') => {
        const fetchedBalance = await abstraxionClient?.getBalance(
            wallet.account.address,
            denom
        );

        setBalance(fetchedBalance ?? null);
    }, [abstraxionClient, wallet.account.address]);

    const updateBalance = useCallback(() => {
        if (wallet.type === 'abstraxion') {
            updateAbstraxionBalance();
        }
    }, [wallet.type, updateAbstraxionBalance]);

    useEffect(() => {
        updateBalance();
    }, [updateBalance]);

    return balance;
};

export default useBalance;