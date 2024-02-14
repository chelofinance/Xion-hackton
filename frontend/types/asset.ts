import type {AllChains, TokenSymbols} from '@/constants/app';
import BigNumber from 'bignumber.js';

export type NFT = Readonly<{
  nftName: string;
  description: string;
  imgSrc: string;
  contract: {
    address: string;
    buyAddr: string;
    id: string;
    price: string;
  };
  floorPrice: {
    value: number;
    symbol: TokenSymbols;
  };
}>;

export type ICA = Readonly<{
  icaMultisigAddress: string;
  icaControllerAddress: string;
}>;

export type Multisig = Readonly<{
  voters: readonly {addr: string; weight: number; share: number}[];
  govThreshold: number;
}>;

export type RaisingNFT = NFT &
  Readonly<{
    chain: AllChains;
    participants: number;
    raisedAmount: number;
  }>;

export type NFTVault = RaisingNFT &
  Readonly<{
    ica: ICA;
    multisig: Multisig;
  }>;

export type MyNFTVault = NFTVault &
  Readonly<{
    priceUSD: BigNumber;
    share: number;
    shareUSD: BigNumber;
  }>;
