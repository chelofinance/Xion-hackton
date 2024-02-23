import React from 'react';
import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import {formatNumber} from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import {COIN_DICT, TEST_VAULT, TokenSymbols} from '@/constants/app';
import Button from '@/components/Button';
import {ButtonStatus} from '@/components/Button/types';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createChannelProposal, createProposal, executeProposal} from '@/utils/multisig';
import {chainConfigMap, AppChains} from '@/constants/app';
import {injectiveClient} from '@/utils/injective';
import {InjectiveSigningStargateClient} from '@injectivelabs/sdk-ts/dist/cjs/core/stargate';
import {createIcaBuyMsg} from '@/utils/ica';
import {useRouter} from 'next/router';
import useRaisingNFTVault from '@/hooks/useRaisingNFTVault';
import PageLoader from '@/components/PageLoader';
import BigNumber from 'bignumber.js';

const CONFIG = chainConfigMap[AppChains.XION_TESTNET];
const INJECTIVE_ID = 'injective-888';

const createKeplrSigner = async () => {
  (window as any).keplr.defaultOptions = {
    sign: {preferNoSetFee: true},
  };
  //await (window as any).keplr.experimentalSuggestChain(INJECTIVE_ID);
  //(window as any).keplr.enable(INJECTIVE_ID);
  const offlineSigner: any = await (window as any).keplr.getOfflineSignerAuto(INJECTIVE_ID);

  return offlineSigner;
};

const CreateVault: NextPage = () => {
  const [status, setStatus] = React.useState<ButtonStatus>('enabled');
  const {client} = useAbstraxionSigningClient();
  const router = useRouter();
  const {address} = router.query;

  const {data: account} = useAbstraxionAccount();
  const [vault, setVault] = React.useState('');
  const [vaultBalance, setVaultBalance] = React.useState<string>('');
  const [{client: cosmosCli, signer}, setCosmos] = React.useState<{
    client: InjectiveSigningStargateClient | null;
    signer: any;
  }>({
    client: null,
    signer: null,
  });
  const nft = useRaisingNFTVault(address as string | undefined);

  const init = async () => {
    try {
      const keplrSigner = await createKeplrSigner();
      const {client} = await injectiveClient(keplrSigner);
      const balance = await client.getBalance(TEST_VAULT.icaAccount.address, 'inj');

      setCosmos({client, signer: keplrSigner});
      setVaultBalance(balance.amount);
    } catch (err) {
      console.log('ERR SETTING UP', err);
    }
  };

  const handleICABuyNft = async () => {
    if (!nft) return;

    try {
      const proposal = createIcaBuyMsg({
        ica: TEST_VAULT.icaAccount.address,
        buyContract: nft.buyContractAddress,
        nftContract: nft.collection.contractAddress,
        tokenId: nft.tokenId,
        cost: new BigNumber(nft.fixedPrice.value.toString()).shiftedBy(18).toString(),
      });
      const {proposal_id} = await createProposal({
        client,
        account,
        injectiveMsg: proposal,
        icaMultisigAddress: CONFIG.proxyMultisig.address,
        icaControllerAddress: TEST_VAULT.icaController.address,
      });
      await executeProposal(client, account, CONFIG.proxyMultisig.address, Number(proposal_id));
    } catch (err) {
      console.log('ERR:', err);
    }
  };

  const handleCreateChannel = async () => {
    try {
      const {proposal_id} = await createChannelProposal({
        client,
        account,
        icaMultisigAddress: CONFIG.proxyMultisig.address,
        icaControllerAddress: TEST_VAULT.icaController.address,
      });
      await executeProposal(client, account, CONFIG.proxyMultisig.address, Number(proposal_id));
    } catch (err) {
      console.log('ERR:', err);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  if (!nft) return <PageLoader />;

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Create Vault</Heading>

      <section className="space-y-4 mt-20">
        <div className="flex items-stretch gap-x-10">
          <div className="grow-0 shrink-0 w-fit flex flex-col gap-y-4">
            <NFTTumbnail size="xl" imgSrc={nft.imgSrc} className="grow-0 shrink-0" />
            <div className="flex items-center gap-x-2">
              <Button
                color="primary"
                type="outline"
                size="xs"
                label="Create Channel"
                iconType="arrow_forward"
                className="w-full md:w-fit"
                onClick={handleCreateChannel}
                status={status}
              />
            </div>
          </div>

          <div className="grow shrink space-y-4">
            <Heading tagName="h3">{nft.nftName}</Heading>

            <Card color="glass" className="flex flex-col items-stretch justify-between gap-x-4 p-4 text-body">
              <div className="flex justify-between w-full">
                <div className="h-6 flex flex-col justify-center Font_label_14px">Fixed price</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount size="xl" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(nft.fixedPrice.value, COIN_DICT[nft.fixedPrice.symbol].decimals)} />
                </div>
              </div>

              <div className="flex justify-between w-full">
                <div className="h-6 flex flex-col justify-center Font_label_14px">Vault balance</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount size="xl" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(nft.raisedAmount)} />
                </div>
              </div>
            </Card>
            <div className="h-6 flex flex-col justify-center">{vault.length > 0 && `Vault: ${vault}`}</div>

            <div className="flex items-center justify-end gap-x-4">
              <Button
                color="primary"
                size="lg"
                label="Buy NFT"
                iconType="arrow_forward"
                className="w-full md:w-fit"
                onClick={handleICABuyNft}
                status={status}
              />
            </div>
          </div>
        </div>
      </section>
    </Main>
  );
};

export default CreateVault;
