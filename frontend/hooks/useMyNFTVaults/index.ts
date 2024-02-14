import { NFT_VAULTS_DICT } from "@/constants/app";
import type { MyNFTVault, NFTVault } from "@/types/asset";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import useOraclePrice from "../useOraclePrice";

/**
 * 
 * @todo query the NFT vaults which includes me as a member
 */
const useMyNFTVaults = (address: string | undefined): {
    ownedVaults: readonly MyNFTVault[];
    raisingVaults: readonly MyNFTVault[];
} => {
    const { getOraclePrice } = useOraclePrice();

    const getMyNFTVaultDetails = useCallback((vault: NFTVault): MyNFTVault => {
        const oraclePrice = getOraclePrice(vault.fixedPrice.symbol);
        const priceUSD = new BigNumber(vault.fixedPrice.value).times(oraclePrice);
  
        const share = vault.multisig.voters.find(voter => voter.addr === address)?.share ?? 0;
        const shareUSD = priceUSD.times(share);
        
        return {
            ...vault,
            priceUSD,
            share,
            shareUSD,
        }
    }, [address]);

    const ownedVaults = !!address ? [...Object.values(NFT_VAULTS_DICT), ...Object.values(NFT_VAULTS_DICT).slice(0, 2)] : [];
    const raisingVaults = !!address ? Object.values(NFT_VAULTS_DICT).slice(0, 2) : [];

    return { 
        ownedVaults: ownedVaults.map(getMyNFTVaultDetails),
        raisingVaults: raisingVaults.map(getMyNFTVaultDetails),
    };
};

export default useMyNFTVaults;