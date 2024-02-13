import React from 'react';
import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import {formatNumber} from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import {TokenSymbols} from '@/constants/app';
import Button from '@/components/Button';
import {ButtonStatus} from '@/components/Button/types';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createProposal} from '@/utils/multisig';
import {chainConfigMap, AppChains} from '@/constants/app';
import {injectiveClient, transferInjective} from '@/utils/injective';
import {InjectiveSigningStargateClient} from '@injectivelabs/sdk-ts/dist/cjs/core/stargate';
import {createIcaBuyMsg} from '@/utils/ica';

const NFT_DETAIL: {
  id: string;
  nftName: string;
  imgSrc: string;
  price: number;
  participants: number;
} = {
  id: 'MultiSig 1',
  nftName: 'Monkey - 2004(WOOD)',
  imgSrc: 'https://images.talis.art/tokens/6582d0be4a3988d286be0f9c/mediaThumbnail',
  price: 0.1,
  participants: 13133,
};

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

  const init = async () => {
    try {
      const keplrSigner = await createKeplrSigner();
      const {client} = await injectiveClient(keplrSigner);
      const balance = await client.getBalance(CONFIG.icaAccount.address, 'inj');

      setCosmos({client, signer: keplrSigner});
      setVaultBalance(balance.amount);
    } catch (err) {
      console.log('ERR SETTING UP', err);
    }
  };

  const handleVaultTransfer = async () => {
    try {
      const accounts = await signer.getAccounts();
      const addr = accounts[0].address;

      if (!cosmosCli) {
        throw new Error('bad initialization');
      }
      console.log(accounts);

      await transferInjective({
        client: cosmosCli,
        amount: '100000000000000000',
        recipient: CONFIG.icaAccount.address,
        account: addr,
      });
    } catch (err) {
      console.log('ERR TRANSFER', err);
    }
  };

  const handleICABuyNft = async () => {
    const proposal = createIcaBuyMsg({
      ica: CONFIG.icaAccount.address,
      buyContract: 'inj1qt5ztu5l3cdkcwzsv2pe9u2mk3fq56rdckr0r7',
      nftContract: 'inj1v3gg98tu6u7wq3a5dtzk97avk5rp97srz47wrs',
      tokenId: '0',
      cost: '100000000000000000',
    });
    await createProposal({
      client,
      account,
      injectiveMsg: proposal,
      icaMultisigAddress: CONFIG.cw3FixedMultisig.address,
      icaControllerAddress: CONFIG.icaController.address,
    });
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Create Vault</Heading>

      <section className="space-y-4 mt-20">
        <div className="flex items-stretch gap-x-10">
          <NFTTumbnail size="xl" imgSrc={NFT_DETAIL.imgSrc} className="grow-0 shrink-0" />

          <div className="grow shrink space-y-4">
            <Heading tagName="h3">{NFT_DETAIL.nftName}</Heading>

            <Card color="glass" className="flex flex-col items-stretch justify-between gap-x-4 p-4 text-body">
              <div className="flex justify-between w-full">
                <div className="h-6 flex flex-col justify-center">Price:</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount size="xl" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(NFT_DETAIL.price)} />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div className="h-6 flex flex-col justify-center">Vault balance:</div>

                <div className="flex flex-col gap-y-2 items-end">
                  <CoinAmount size="xl" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(NFT_DETAIL.price)} />
                </div>
              </div>
            </Card>
            <div className="h-6 flex flex-col justify-center">{vault.length > 0 && `Vault: ${vault}`}</div>

            <div className="flex justify-between">
              <Button
                color="primary"
                size="md"
                label="Send ICA funds"
                iconType="arrow_forward"
                className="w-full md:w-fit"
                onClick={handleVaultTransfer}
                status={status}
              />
              <Button
                color="primary"
                size="md"
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
