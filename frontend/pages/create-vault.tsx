import type { NextPage } from 'next';
import { useState } from 'react';
import Main from '@/components/Main';
import NFTsTable from '@/components/tables/NFTsTable';
import MobileAppLaunchSection from '@/components/home/MobileAppLaunchSection';
import useUserAgent from '@/hooks/useUserAgent';
import Heading from '@/components/Heading';
import VaultSearchTextInput from '@/components/form-presets/VaultSearchTextInput';
import Button from '@/components/Button';
import QUERY_TALIS_TOKENS, { type QueryTalisTokensParams } from '@/data/graphql/queries/queryTalisTokens';
import { useQuery } from '@apollo/client';

const CreateVault: NextPage = () => {

  return (
    <>
        <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom md:mx-page_x">
          <Heading tagName="h2">
            Create Vault
          </Heading>

          <section className="space-y-4">
            <div className="flex items-center justify-center gap-x-4">
              <span className="text-primary">or</span>
              <Button color="primary" size="sm" label="Create vault" iconType="arrow_forward" className="w-full md:w-fit" />
            </div>
          </section>

          <NFTsTable tooltipLayer="base" className="mt-20" />
        </Main>
    </>
  );
};

export default CreateVault;
