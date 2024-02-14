import { NFT_VAULTS_DICT } from "@/constants/app";
import { RaisingNFT } from "@/types/asset";

const useRaisingNFTVaults = () => {
    const RAISING_NFT_VAULTS: readonly RaisingNFT[] = Object.values(NFT_VAULTS_DICT);
    return RAISING_NFT_VAULTS;
}

export default useRaisingNFTVaults;