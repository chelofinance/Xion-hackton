import type BigNumber from "bignumber.js";

export type TokenData = {
    logoURI: string;
};

export type BalanceData = {
    symbol: string;
    value: BigNumber;
    decimals: number;
    tokenAddress: string;
  }