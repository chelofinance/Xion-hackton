import { ConnectedWallet } from "@/types/wallet";
import useProcessing from "../useProcessing";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { CreateIcaMultisigResult, createIcaMultisig } from "@/utils/multisig";
import { AppChains, chainConfigMap } from "@/constants/app";
import { useCallback } from "react";

const useCreateVault = (userWallet: ConnectedWallet | null) => {
    const { target, startProcessing, stopProcessing } = useProcessing<boolean>();

    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const createVault = useCallback(async (options?: { memberAddresses: string[] }): Promise<CreateIcaMultisigResult | null> => {
        if (!userWallet) {
            console.log('Connected account not found.');
            return null;
        }

        if (!abstraxionClient) {
            console.log('Signing client not found.');
            return null;
        }

        startProcessing(true);

        try {
        //   const abstractAccount = await abstraxionClient.getAccount(userWallet.account.address);
    
        //   if (!abstractAccount) {
        //     stopProcessing();
        //     console.log('Abstract account not found.');
        //     return null;
        //   }

          const account = { bech32Address: userWallet.account.address };
          const icaFactoryAddress = chainConfigMap[AppChains.XION_TESTNET].icaFactory.address;
          const memberAddresses = options?.memberAddresses ? [userWallet.account.address, ...options.memberAddresses] : [userWallet.account.address];
          
          const response = await createIcaMultisig(
            abstraxionClient,
            account,
            icaFactoryAddress,
            memberAddresses
          );

          console.log('createIcaMultisig response: ', response);

          stopProcessing();

          return response;
        } catch (err) {
          stopProcessing();
          console.log('RALPH ERR: ', err);

          return null;
        }
      }, [userWallet, abstraxionClient, startProcessing, stopProcessing]);

      return {
        createVault,
        isProcessing: target === true,
      }
};

export default useCreateVault;