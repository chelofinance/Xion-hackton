import { RAISING_NFT_VAULTS_DICT } from "@/constants/app";
import { useCallback, useMemo } from "react";

const useRaisingNFTVault = (collectionAddressTokenId: string) => {
    const getVault = useCallback((collectionAddressTokenId: string) => RAISING_NFT_VAULTS_DICT[collectionAddressTokenId], []);
    
    return useMemo(() => getVault(collectionAddressTokenId), [collectionAddressTokenId]);
}

export default useRaisingNFTVault;