import useProcessing from '../useProcessing';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createIcaProposal} from '@/utils/multisig';
import {useCallback} from 'react';
import {MyVault, RaisingNFT} from '@/types/asset';
import {createIcaSellMsg, createIcaSellMsgInjective} from '@/utils/ica';

const DEFAULT_COST = '1000000000000000';

const useICASell = () => {
  const {target, startProcessing, stopProcessing} = useProcessing<boolean>();
  const {data: account} = useAbstraxionAccount();
  const {client} = useAbstraxionSigningClient();

  const sellNftIca = useCallback(
    async (vault?: MyVault, nft?: RaisingNFT) => {
      startProcessing(true);
      if (!nft) return;

      if (!vault) {
        alert('Create a vault to buy NFTs.');
        return;
      }

      if (!nft) {
        alert('NFT doesnt exists');
        return;
      }

      try {
        const proposalMsg = createIcaSellMsg({
          ica: vault.icaAccountAddress,
          nftContract: nft.collection.contractAddress,
          tokenId: nft.tokenId,
          cost: DEFAULT_COST,
        });
        console.log('PROPOSAl', proposalMsg, {...nft});
        //return;
        const {proposal_id} = await createIcaProposal({
          client,
          account,
          injectiveMsgs: [proposalMsg],
          xionMsgs: [],
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
