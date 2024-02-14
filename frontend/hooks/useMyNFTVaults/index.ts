import { NFT_VAULTS } from "@/constants/app";
import { testVaultAtom } from "@/store/states";
import type { MyNFTVault, NFTVault } from "@/types/asset";
import { useAtom } from "jotai";
import { useCallback } from "react";

/**
 * 
 * @todo query the NFT vaults which includes me as a member
 */
const useMyNFTVaults = (address: string | undefined): readonly MyNFTVault[] => {
    const [testVault] = useAtom(testVaultAtom);

    const myVaults: readonly NFTVault[] = testVault ? NFT_VAULTS.filter(vault => vault.multisig.voters.find(voter => voter.addr === address)) : [];

    const getMyNFTVaultDetails = useCallback((vault: NFTVault): MyNFTVault => {
        // const oraclePrice = getOraclePrice(vault.fixedPrice.symbol);
        // const priceUSD = new BigNumber(vault.fixedPrice.value).times(oraclePrice);
  
        const share = vault.multisig.voters.find(voter => voter.addr === address)?.share ?? 0;
        // const shareUSD = priceUSD.times(share);
        
        return {
            ...vault,
            // priceUSD,
            share,
            // shareUSD,
        }
    }, [address]);

    const raisingVaults = !!address ? myVaults : [];

    return raisingVaults.map(getMyNFTVaultDetails);
};

export default useMyNFTVaults;