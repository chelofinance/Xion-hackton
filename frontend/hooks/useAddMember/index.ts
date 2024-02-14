import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import {  useState } from "react";
import { addMember as addMultisigMember } from "@/utils/multisig";

const useAddMember = (icaMultisigAddress: string): { 
    addMember:(newMemberAddress: string) => Promise<void>;
} => {
    const { client: abstraxionClient } = useAbstraxionSigningClient();
    const { data: account } = useAbstraxionAccount();

    const [feeAmount, setFeeAmount] = useState<string>('0.01');

    const addMember = async (newMemberAddress: string) => {
    
        const response = await addMultisigMember(
          abstraxionClient, 
          account, 
          icaMultisigAddress,
          newMemberAddress,
          feeAmount,
          'uxion',
          );
    
        console.log("response", response);
    };
      
    return {
        addMember,
    };
};

export default useAddMember;