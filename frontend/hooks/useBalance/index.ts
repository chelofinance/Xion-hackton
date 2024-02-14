import { ConnectedWallet } from "@/types/wallet";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import type { Coin } from "@cosmjs/stargate";
import { useCallback, useEffect, useMemo, useState } from "react";
import FTAmount from "@/struct/FTAmount";

/**
 * 
 * @todo implement balance polling
 */
const useBalance = (wallet: ConnectedWallet | null): FTAmount => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const [balance, setBalance] = useState<Coin | null>(null);

    const updateAbstraxionBalance = useCallback(async (denom: string) => {
        try {
            const fetchedBalance = await abstraxionClient?.getBalance(
                wallet?.account.address ?? '',
                denom
            );
    
            setBalance(fetchedBalance ?? null);
        } catch(e) {
            console.log(e);
        }

    }, [abstraxionClient, wallet?.account.address]);

    const updateBalance = useCallback(() => {
        if (wallet?.type === 'abstraxion') {
            updateAbstraxionBalance('uxion');
        }
    }, [wallet?.type, updateAbstraxionBalance]);

    useEffect(() => {
        updateBalance();
    }, [updateBalance]);

    const priceOracle = 1.1;

    return useMemo(() => new FTAmount(balance ?? { amount: '0', denom: 'uxion' }, priceOracle), [balance, priceOracle]);
};

export default useBalance;