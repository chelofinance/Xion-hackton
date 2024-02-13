import { PRICE_ORACLE_DICT, TokenSymbols } from "@/constants/app";
import { useCallback } from "react";

const useOraclePrice = () => {
    const getOraclePrice = useCallback((symbol: TokenSymbols) => {
        return PRICE_ORACLE_DICT[symbol];
    }, []);

    return {
        getOraclePrice,
    }
};

export default useOraclePrice;