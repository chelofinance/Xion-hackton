import type {AllChains, TokenSymbols} from '@/constants/app';
import BigNumber from 'bignumber.js';

export type NFTCollection = Readonly<{
  collectionId: string;
  collectionName: string;
  contractAddress: string;
  createdByAddress: string;
  floorPrice: {
    value: number;
    symbol: TokenSymbols;
  };
}>;

export type NFT = Readonly<{
  collection: NFTCollection;
  tokenId: string;
  nftName: string;
  description: string;
  imgSrc: string;
  // contract: { 
  //   address: string;
  // };
  fixedPrice: {
    value: number;
    symbol: TokenSymbols;
  };
  ownerAddress: string;
  // contract: {
  //   address: string;
  //   buyAddr: string;
  //   id: string;
  //   price: string;
  // };
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
