import { RAISING_NFT_VAULTS_DICT } from "@/constants/app";
import { useCallback, useMemo } from "react";

const useRaisingNFTVault = (contractAddress: string) => {
    const getVault = useCallback((contractAddress: string) => RAISING_NFT_VAULTS_DICT[contractAddress], []);
    
    return useMemo(() => getVault(contractAddress), [contractAddress]);
}

export default useRaisingNFTVault;