import { NFT_VAULTS_DICT } from "@/constants/app";
import { useCallback, useMemo } from "react";

const useRaisingNFTVault = (collectionAddressTokenId: string | undefined) => {
    const getVault = useCallback((collectionAddressTokenId: string) => NFT_VAULTS_DICT[collectionAddressTokenId], []);
    
    return useMemo(() => !!collectionAddressTokenId ? getVault(collectionAddressTokenId) : undefined, [collectionAddressTokenId, getVault]);
}

export default useRaisingNFTVault;