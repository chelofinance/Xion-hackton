import React from 'react';
import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import {AppChains, TokenSymbols} from '@/constants/app';
import Button from '@/components/Button';
import {ButtonStatus} from '@/components/Button/types';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {createIcaMultisig} from '@/utils/multisig';
import {chainConfigMap} from '@/constants/app';

const NFT_DETAIL: {
  id: string;
  nftName: string;
  imgSrc: string;
  price: number;
  raisedAmountUSD: number;
  participants: number;
} = {
  id: 'MultiSig 1',
  nftName: 'Monkey - 2004(WOOD)',
  imgSrc: 'https://images.talis.art/tokens/6582d0be4a3988d286be0f9c/mediaThumbnail',
  price: 1313133,
  raisedAmountUSD: 11111381919,
  participants: 13133,
};

const CreateVault: NextPage = () => {
  const [status, setStatus] = React.useState<ButtonStatus>('enabled');
  const {client} = useAbstraxionSigningClient();
  const {data: account, isConnected} = useAbstraxionAccount();
  const [vault, setVault] = React.useState('');

  const handleCreateVault = async () => {
    try {
      setStatus('processing');

      const abstractAccount = await client?.getAccount(account.bech32Address);
      const ica_multisig_address_response = await createIcaMultisig(
        client,
        account,
        chainConfigMap[AppChains.XION_TESTNET].icaFactory.address,
        [abstractAccount?.address || '']
      );
      setVault(ica_multisig_address_response?.ica_multisig_address);

      setStatus('enabled');
    } catch (err) {
      console.log('RALPH ERR: ', err);
    }
  };

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Create Vault</Heading>

      <section className="space-y-4 mt-20">
        <div className="flex items-stretch gap-x-10">
          <NFTTumbnail size="xl" imgSrc={NFT_DETAIL.imgSrc} className="grow-0 shrink-0" />

          <div className="grow shrink space-y-4">
            <Heading tagName="h3">{NFT_DETAIL.nftName}</Heading>

            <Card color="glass" className="flex items-stretch justify-between gap-x-4 p-4 text-body">
              <div className="h-6 flex flex-col justify-center">Fixed price</div>

              <div className="flex flex-col gap-y-2 items-end">
                <CoinAmount size="xl" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(NFT_DETAIL.price)} />
                <div className="flex items-center justify-between">
                  <span className="Font_data_14px_num text-caption">{formatUSD(12.311)}</span>
                </div>
              </div>
            </Card>
            <div className="h-6 flex flex-col justify-center">{vault.length > 0 && `Vault: ${vault}`}</div>

            <div className="flex justify-end">
              <Button
                color="primary"
                size="lg"
                label="Create vault"
                iconType="arrow_forward"
                className="w-full md:w-fit"
                onClick={handleCreateVault}
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
