import {AbstraxionAccount, ConnectedWallet} from '@/types/wallet';
import useProcessing from '../useProcessing';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createIcaMultisig, createIcaProposal, executeProposal} from '@/utils/multisig';
import {AppChains, chainConfigMap, COIN_DICT} from '@/constants/app';
import {useCallback} from 'react';
import {SendTxResult} from '@/types/tx';
import {MyVault, RaisingNFT} from '@/types/asset';
import {createIcaBuyMsg, createSendIbcMsg} from '@/utils/ica';
import {start} from 'repl';
import {XionSigningClient} from '@/utils/xion';
// import { createICAMultisigVault } from "@/utils/xion";

type CreatedVault = {
  txHash: string;
  multisigAddress: string | undefined;
};

const useICABuy = (client: XionSigningClient) => {
  const {target, startProcessing, stopProcessing} = useProcessing<boolean>();
  const {data: account} = useAbstraxionAccount();

  const buyNftIca = useCallback(
    async (vault: MyVault, nft?: RaisingNFT) => {
      startProcessing(true);
      if (!nft) return;

      // if (!vault) {
      //   alert('Create a vault to buy NFTs.');
      //   return;
      // }

      // const vaultUsed = myVaults.find((vault) => vault.multisigAddress === router.query.vault) || (myVaults[0] as MyVault);

      try {
        const sendIcaTokens = createSendIbcMsg({
          icaAddress: vault.icaAccountAddress,
          multisigAddress: vault.multisigAddress,
          amount: nft.fixedPrice.value.toString(),
        });
        const buyNft = createIcaBuyMsg({
          ica: vault.icaControllerAddress || 'relaying',
          buyContract: nft.buyContractAddress,
          nftContract: nft.collection.contractAddress,
          tokenId: nft.tokenId,
          cost: nft.fixedPrice.value.shiftedBy(COIN_DICT[nft.fixedPrice.symbol].decimals).dp(0).toString(),
        });

        const {proposal_id} = await createIcaProposal({
          client,
          account,
          injectiveMsgs: [buyNft],
          xionMsgs: [sendIcaTokens],
          multisig: vault.multisigAddress,
          icaController: vault.icaControllerAddress,
        });

        console.log('createIcaProposal response:', {proposal_id, multisig: vault.multisigAddress});
      } catch (error) {
        console.log('createIcaProposal faile:', error);
      }
      stopProcessing();
    },
    [account, client, startProcessing, stopProcessing]
  );

  return {
    buyNftIca,
    isProcessing: target === true,
  };
};

export default useICABuy;
