import React, { useEffect, useState } from 'react';
import type {NextPage} from 'next';
import Main from '@/components/Main';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import {AppChains, TEST_VAULT, TokenSymbols} from '@/constants/app';
import Button from '@/components/Button';
import {ButtonStatus} from '@/components/Button/types';
import {useAbstraxionAccount, useAbstraxionSigningClient} from '@burnt-labs/abstraxion';
import {CreateIcaMultisigResult, createIcaMultisig} from '@/utils/multisig';
import {chainConfigMap} from '@/constants/app';
import router from 'next/router';
import CopyHelper from '@/components/CopyHelper';
import { shortenAddress, shortenText } from '@/utils/text';
import Head from 'next/head';
import { useAtom } from 'jotai';
import { testVaultAtom } from '@/store/states';

const CreateVault: NextPage = () => {
  const [status, setStatus] = React.useState<ButtonStatus>('enabled');
  const {client} = useAbstraxionSigningClient();
  const {data: account, isConnected} = useAbstraxionAccount();
  const [vault, setVault] = useState<CreateIcaMultisigResult | null>(null);

  const [testVault, setTestVault] = useAtom(testVaultAtom);

  const handleCreateVault = async () => {
    try {
      setStatus('processing');

      const abstractAccount = await client?.getAccount(account.bech32Address);

      console.log('abstractAccount', abstractAccount);
      const result = await createIcaMultisig(
        client,
        account,
        chainConfigMap[AppChains.XION_TESTNET].icaFactory.address,
        [abstractAccount?.address || '']
      );
      const response = result.response ?? null;

      setVault(response);

      setTestVault(TEST_VAULT);

      setStatus('enabled');
    } catch (err) {
      console.log('RALPH ERR: ', err);
    }
  };

  return (
    <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
      <Heading tagName="h2">Create Vault</Heading>

      <section className="mt-20">
        <div className="space-y-4">
          <Card color="glass" className="p-4 text-body">
            You can create vaults to propose buying or selling NFTs.
            <br/>
            Shall we create?
          </Card>

          {vault && <Card className="p-4 space-y-8">
            <Heading tagName="h3" color="on_primary">
              Vault created!
            </Heading>

            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="Font_label_14px">Address</div>

                <CopyHelper toCopy={TEST_VAULT.icaAccount.address} className="text-ground">
                  <span className="w-fit truncate Font_button_md">{shortenAddress(TEST_VAULT.icaAccount.address, 4, 4)}</span>
                </CopyHelper>
              </div>

              {vault.channel_init_info.src_channel_id && <div className="flex justify-between">
                <div className="Font_label_14px">Channel ID</div>

                <CopyHelper toCopy={vault.channel_init_info.src_channel_id} className="text-ground">
                  <span className="w-fit truncate Font_button_md">{vault.channel_init_info.src_channel_id}</span>
                </CopyHelper>
              </div>}

              {vault.channel_init_info.src_port_id && <div className="flex justify-between">
                <div className="Font_label_14px">Port ID</div>

                <CopyHelper toCopy={vault.channel_init_info.src_port_id} className="text-ground">
                  <span className="w-fit truncate Font_button_md">{shortenText(vault.channel_init_info.src_port_id, 20)}</span>
                </CopyHelper>
              </div>}

              {vault.channel_init_info.destination_port && <div className="flex justify-between">
                <div className="Font_label_14px">Destination Port</div>

                <CopyHelper toCopy={vault.channel_init_info.destination_port} className="text-ground">
                  <span className="w-fit truncate Font_button_md">{vault.channel_init_info.destination_port}</span>
                </CopyHelper>
              </div>}
            </div>
          </Card>}

          <div className="flex justify-end">
            <Button
              color="primary"
              size="lg"
              label={vault ? 'See my vaults' : 'Create vault'}
              iconType="arrow_forward"
              className="w-full md:w-fit"
              onClick={vault ? () => router.push('my-vaults') : handleCreateVault}
              status={status}
            />
          </div>
        </div>

      </section>
    </Main>
  );
};

export default CreateVault;
