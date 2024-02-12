import type { ConnectedWallet } from "@/types/wallet";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";

const useTrxClient = (wallet: ConnectedWallet) => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();

};

export default useTrxClient;