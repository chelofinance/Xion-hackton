import type { Coin } from "@cosmjs/stargate";
import { useCallback, useEffect, useMemo, useState } from "react";
import FTAmount from "@/struct/FTAmount";
import { getNetworkEndpoints, Network as InjectvieNetwork } from '@injectivelabs/networks';
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts';
import { COIN_DICT, TokenSymbols } from "@/constants/app";

/**
 * 
 * @todo implement balance polling
 */
const useBalance = (address: string | undefined) => {
    const chainGrpcBankApi = useMemo(() => {
        const endpoints = getNetworkEndpoints(InjectvieNetwork.Testnet);
        return new ChainGrpcBankApi(endpoints.grpc);
    }, []);

    const [balanceRecord, setBalanceRecord] = useState<{ [denom: string]: Coin }>({});

    const updateInjectiveBalance = useCallback(async () => {
        if (!address) return;

        try {
            const balancesResponse = await chainGrpcBankApi.fetchBalances(address);
            const record = balancesResponse.balances.reduce<{ [denom: string]: Coin }>((accm, balance) => {
                return {
                    ...accm,
                    [balance.denom]: balance,
                }
            }, {});

            setBalanceRecord(record);
        } catch(e) {
            console.log(e);
        }

    }, [chainGrpcBankApi, address]);

    useEffect(() => {
        updateInjectiveBalance();
    }, [updateInjectiveBalance]);

    const getBalance = useCallback((symbol: TokenSymbols): FTAmount => {
        const coin = COIN_DICT[symbol];
        const balance: Coin | undefined = balanceRecord[coin.denom];
        return new FTAmount(balance ?? { amount: '0', denom: coin.denom }, coin.decimals);
    }, [balanceRecord]);

    return { getBalance };
};

export default useBalance;