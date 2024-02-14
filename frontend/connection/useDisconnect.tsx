import { userWalletAtom } from "@/store/states";
import { Abstraxion, useAbstraxionAccount, useModal as useAbstraxionModal } from "@burnt-labs/abstraxion";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

const useDisconnect = ({ onDisconnect }: { onDisconnect: () => void }) => {
    const [, setUserWallet] = useAtom(userWalletAtom);

    const { data: xionAccount, isConnected: isXionAcccountConnected } = useAbstraxionAccount();

    useEffect(() => {
        if (!isXionAcccountConnected || xionAccount.bech32Address === '') {
            setUserWallet(null);
            onDisconnect();
        }
            
    }, [xionAccount.bech32Address, isXionAcccountConnected]);

    const [, setShowAbstraxion] = useAbstraxionModal();

    const onCloseAbstraxion = useCallback(() => {
        setShowAbstraxion(false);
      }, [setShowAbstraxion]);

    const  disconnect = useCallback(() => setShowAbstraxion(true), [setShowAbstraxion]);

    return { disconnect, onClose: onCloseAbstraxion };
};

export default useDisconnect;