import useProcessing from '../useProcessing';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createIcaProposal} from '@/utils/multisig';
import {COIN_DICT} from '@/constants/app';
import {useCallback} from 'react';
import {MyVault, RaisingNFT} from '@/types/asset';
import {createIcaBuyMsg} from '@/utils/ica';

const useICASell = () => {
  const {target, startProcessing, stopProcessing} = useProcessing<boolean>();
  const {data: account} = useAbstraxionAccount();
  const {client} = useAbstraxionSigningClient();

  const sellNftIca = useCallback(
    async (nft?: RaisingNFT, vault?: MyVault) => {
      startProcessing(true);
      if (!nft) return;

      if (!vault) {
        alert('Create a vault to buy NFTs.');
        return;
      }

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
    sellNftIca,
    isProcessing: target === true,
  };
};

export default useICASell;
