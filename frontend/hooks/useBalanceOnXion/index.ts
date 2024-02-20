import type { Coin } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";
import FTAmount from "@/struct/FTAmount";
import { AllChains, COIN_DICT, TokenSymbols } from "@/constants/app";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { getBalanceOnXion } from "@/utils/xion";

/**
 * 
 * @todo implement balance polling
 */
const useBalanceOnXion = (address: string | undefined) => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const [balanceRecord, setBalanceRecord] = useState<{ [denom: string]: Coin }>({});

    const updateBalance = useCallback(async () => {
        if (!address) return;

        if (!abstraxionClient) {
            console.log('Signing client not found.');
            return;
        }

        // const balance = await getBalanceOnXion(abstraxionClient, { address, denom: COIN_DICT[TokenSymbols.INJ].denomOn[AllChains.XION_TESTNET] });

        try {
            const record = await Object.values(TokenSymbols).reduce<Promise<{ [denom: string]: Coin }>>(async (accmPromise, symbol) => {
                const accm = await accmPromise;
                const denom = COIN_DICT[symbol].denomOn[AllChains.XION_TESTNET];

                const balance = await getBalanceOnXion(abstraxionClient, { address, denom });
                const newAccm = { ...accm, [denom]: balance };
    
                return new Promise(resolve => {
                    resolve(newAccm);
                })
            }, Promise.resolve({}));

            setBalanceRecord(record);
        } catch(error) {
            console.log(error);
        }
    }, [abstraxionClient, address]);

    useEffect(() => {
        updateBalance();
    }, [updateBalance]);

    const getBalance = useCallback((symbol: TokenSymbols): FTAmount => {
        const coin = COIN_DICT[symbol];
        const denom = coin.denomOn[AllChains.XION_TESTNET];
        const balance: Coin | undefined = balanceRecord[denom];
        return new FTAmount(balance ?? { amount: '0', denom }, coin.decimals);
    }, [balanceRecord]);

    return { updateBalance, getBalance };
};

export default useBalanceOnXion;