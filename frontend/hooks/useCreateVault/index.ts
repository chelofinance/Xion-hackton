import { AbstraxionAccount, ConnectedWallet } from "@/types/wallet";
import useProcessing from "../useProcessing";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { createIcaMultisig } from "@/utils/multisig";
import { AppChains, chainConfigMap } from "@/constants/app";
import { useCallback } from "react";
import { SendTxResult } from "@/types/tx";
// import { createICAMultisigVault } from "@/utils/xion";

type CreatedVault = {
    txHash: string;
    multisigAddress: string | undefined;
}

const useCreateVault = (account: AbstraxionAccount) => {
    const { target, startProcessing, stopProcessing } = useProcessing<boolean>();

    const { client: abstraxionClient } = useAbstraxionSigningClient();

    const createVault = useCallback(async (options?: { memberAddresses: string[] }): Promise<SendTxResult<CreatedVault> | null> => {
        if (!account) {
            console.log('Connected account not found.');
            return null;
        }

        if (!abstraxionClient) {
            console.log('Signing client not found.');
            return null;
        }

        startProcessing(true);

        try {
        //   const abstractAccount = await abstraxionClient.getAccount(userWallet.account.bech32Address);
    
        //   if (!abstractAccount) {
        //     stopProcessing();
        //     console.log('Abstract account not found.');

        //     return null;
        //   }

        //   const account = abstractAccount;
        //   console.log('account', account);

          const icaFactoryAddress = chainConfigMap[AppChains.XION_TESTNET].icaFactory.address;
          const memberAddresses = options?.memberAddresses ? [account.bech32Address, ...options.memberAddresses] : [account.bech32Address];

          const result = await createIcaMultisig(
            abstraxionClient,
            account,
            icaFactoryAddress,
            memberAddresses
          );

          stopProcessing();

          console.log('createIcaMultisig response: ', result);

          const txHash: string = result?.response?.instantiateResponse?.transactionHash ?? '';
          const multisigAddress: string | undefined = result.response?.ica_multisig_address;
          //   const events = result?.response?.instantiateResponse?.events;


          return result ? { isSuccess: true, response: {
            txHash,
            multisigAddress,
          } } : null;
        } catch (err) {
          stopProcessing();
          console.log('RALPH ERR: ', err);

          return null;
        }
      }, [account, abstraxionClient, startProcessing, stopProcessing]);

      return {
        createVault,
        isProcessing: target === true,
      }
};

export default useCreateVault;