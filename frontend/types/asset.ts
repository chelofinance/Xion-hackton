import type {AllChains, TokenSymbols} from '@/constants/app';
import { ProposalResponse, VoterResponse } from '@/utils/xion';
import BigNumber from 'bignumber.js';

export type NFTCollection = Readonly<{
  collectionId: string;
  collectionName: string;
  contractAddress: string;
  createdByAddress: string;
  floorPrice: {
    value: BigNumber;
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
    value: BigNumber;
    symbol: TokenSymbols;
  };
  ownerAddress: string;
  buyContractAddress: string;
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
    onSale: boolean;
  }>;

/**
 *
 * @todo replace with array of NFTs
 */
export type NFTVault = Readonly<{
  nfts: readonly RaisingNFT[];
  ica: ICA;
  multisig: Multisig;
}>;

export type MyNFTVault = NFTVault &
  Readonly<{
    share: number;
    // shareUSD: BigNumber;
  }>;


  export type MyVault = {
    multisigAddress: string;
    icaControllerAddress: string;
    share: number;
    voters: readonly VoterResponse[];
    threshold: {
        weight: string;
        total_weight: string;
    } | undefined;
    proposals: readonly {
        nft: RaisingNFT;
        proposal: ProposalResponse;
    }[];
}
