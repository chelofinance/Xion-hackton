import {AbstraxionAccount, ConnectedWallet} from '@/types/wallet';
import useProcessing from '../useProcessing';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createIcaMultisig, createIcaProposal} from '@/utils/multisig';
import {AppChains, chainConfigMap, COIN_DICT} from '@/constants/app';
import {useCallback} from 'react';
import {SendTxResult} from '@/types/tx';
import {MyVault, RaisingNFT} from '@/types/asset';
import {createIcaBuyMsg} from '@/utils/ica';
import {start} from 'repl';
// import { createICAMultisigVault } from "@/utils/xion";

type CreatedVault = {
  txHash: string;
  multisigAddress: string | undefined;
};

const useICABuy = () => {
  const {target, startProcessing, stopProcessing} = useProcessing<boolean>();
  const {data: account} = useAbstraxionAccount();
  const {client} = useAbstraxionSigningClient();

  const buyNftIca = useCallback(
    async (nft?: RaisingNFT, vault?: MyVault) => {
      startProcessing(true);
      if (!nft) return;

      if (!vault) {
        alert('Create a vault to buy NFTs.');
        return;
      }

      // const vaultUsed = myVaults.find((vault) => vault.multisigAddress === router.query.vault) || (myVaults[0] as MyVault);

      try {
        const proposalMsg = createIcaBuyMsg({
          ica: vault.icaControllerAddress || 'relaying',
          buyContract: nft.buyContractAddress,
          nftContract: nft.collection.contractAddress,
          tokenId: nft.tokenId,
          cost: nft.fixedPrice.value.shiftedBy(COIN_DICT[nft.fixedPrice.symbol].decimals).dp(0).toString(),
        });

        const {proposal_id} = await createIcaProposal({
          client,
          account,
          injectiveMsg: proposalMsg,
          multisig: vault.multisigAddress,
          icaController: vault.icaControllerAddress,
        });

        console.log('createIcaProposal response:', {proposal_id});
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
