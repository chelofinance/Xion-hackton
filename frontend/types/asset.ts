export type Currency = 'USD';

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