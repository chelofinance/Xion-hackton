import type { BalanceData } from '@/data/types';
import type BigNumber from 'bignumber.js';

export type Currency = 'USD';

export type BalanceItem = Readonly<
  BalanceData & { fiatValue: Record<Currency, BigNumber>; price: Record<Currency, number | null> }
>;

export type TokenMarketData = Readonly<{
  tokenAddress: string;
  decimals: number;
  symbol: string;
  price: Record<Currency, number | null>;
  priceChange24H: number | null;
  marketCap: number | null;
  vol24H: number | null;
  vol24HChangePercentage: number | null;
}>;

export type OwnedNFT = {
  media: any[];
  rawMetadata?: {
    image?: string;
    name: string;
  };
  contract: { 
    address: string;
  };
  floorPrice: {
    symbol: string;
    value: number;
  }
};