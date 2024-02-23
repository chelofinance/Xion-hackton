import type { MyNFTVault, NFTVault } from "@/types/asset";
import { getVaultMultisigs } from "@/utils/xion";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useCallback, useEffect, useState } from "react";

const useMyNFTVaults = (address: string | undefined): {
    myVaults: readonly MyNFTVault[];
    updateMyVaults: () => Promise<void>;
} => {
    const [myVaults, setMyVaults] = useState<readonly MyNFTVault[]>([]);

    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const updateMyVaults = useCallback(async () => {
        if (!address || address === '') {
            console.log('Address not found.');
            return;
        }

        if (!abstraxionClient) {
            console.log('Signing client not found.');
            return;
        }

        await getVaultMultisigs(abstraxionClient, address);

        // const share = vault.multisig.voters.find(voter => voter.addr === address)?.share ?? 0;
        // // const shareUSD = priceUSD.times(share);
        
        // return {
        //     ...vault,
        //     // priceUSD,
        //     share,
        //     // shareUSD,
        // }
    }, [abstraxionClient, address]);

    useEffect(() => {
        updateMyVaults();
    }, [updateMyVaults]);

    return {
        myVaults,
        updateMyVaults,
    }
};

export default useMyNFTVaults;