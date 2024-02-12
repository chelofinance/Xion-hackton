import type { NextPage } from 'next';
import Main from '@/components/Main';
import NFTsTable from '@/components/tables/NFTsTable';
import Heading from '@/components/Heading';
import NFTTumbnail from '@/components/NFTThumbnail';
import Card from '@/components/Card';
import { formatNumber, formatUSD } from '@/utils/number';
import CoinAmount from '@/components/CoinAmount';
import { TokenSymbols } from '@/constants/app';
import Button from '@/components/Button';

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

            <div className="flex justify-end">
              <Button color="primary" size="lg" label="Create vault" iconType="arrow_forward" className="w-full md:w-fit" />
            </div>
          </div>
        </div>
      </section>
    </Main>
  );
};

export default CreateVault;
