import { useCallback, useMemo } from 'react';
import Table from '@/components/Table';
import Heading from '@/components/Heading';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import { formatNumber, formatUSD } from '@/utils/number';
import type { TooltipLayer } from '@/components/Tooltip/styles';
import Image from 'next/image';
import ProgressBar from '@/components/ProgressBar';
import CoinAmount from '@/components/CoinAmount';
import { TokenSymbols } from '@/constants/app';

type NFTsTableRow = {
  id: string;
  nft: JSX.Element;
  nftName: string;
  price: number;
  priceFormatted: string | JSX.Element;
  raisedAmountUSD: number;
  raisedAmountUSDFormatted: string | JSX.Element;
  participants: number;
  participantsFormatted: string | JSX.Element;
};

type NFTsTableProps = {
  className?: string;
  tooltipLayer: TooltipLayer;
};

const HOT_NFT_DEALS: { id: string; nftName: string; imgSrc: string; price: number; raisedAmountUSD: number; participants: number }[] = [
  {
    id: 'MultiSig 1',
    nftName: 'Monkey - 2004(WOOD)',
    imgSrc: 'https://images.talis.art/tokens/6582d0be4a3988d286be0f9c/mediaThumbnail',
    price: 13131313133,
    raisedAmountUSD: 11111381919,
    participants: 13133,
  },
  {
    id: 'MultiSig 2',
    nftName: 'Injective Vandals #341',
    imgSrc: 'https://images.talis.art/tokens/65a091fb10709e02588e13da/mediaThumbnail',
    price: 22414,
    raisedAmountUSD: 4140,
    participants: 111,
  },
  {
    id: 'MultiSig 3',
    nftName: 'Crypto Lady',
    imgSrc: 'https://talis-protocol.mo.cloudinary.net/inj/families/65b2e902e6b67bb48ef359fb/miniaturePicture',
    price: 131313,
    raisedAmountUSD: 138,
    participants: 467,
  },
];

const NFTsTable = ({ className = '', tooltipLayer }: NFTsTableProps) => {
  const rows = useMemo<readonly NFTsTableRow[]>(() => {
    return (
      HOT_NFT_DEALS?.map((item) => {
        const id = String(item.id);

        const nftName = item.nftName;

        const nft = (
          <section className="w-32 flex flex-col items-stretch gap-y-2">
            <Card color="on_primary" className="w-32 h-32 flex items-center justify-center">
              <Image src={item.imgSrc} width={128} height={128} alt="" className="object-cover"/>
            </Card>

            <div className="Font_label_14px text-body truncate">{item.nftName}</div>
          </section>
        );


        const price = item.price;
        const priceFormatted = <CoinAmount size="md" color="body" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(12.23242, 2)} />;

        const raisedAmountUSD = item.raisedAmountUSD;
        const raisedAmountUSDFormatted = (
          <ProgressBar 
            currentNumber={raisedAmountUSD} 
            targetNumber={price} 
            formatOptions={{ currencySymbol: '$' }}
            currentNumberCaption={`raised / ${formatUSD(price, { compact: true })}`}
            className="!w-[300px]" 
          />
        );

        const participants = item.participants;
        const participantsFormatted = formatNumber(participants, 0);

        return {
          id,
          nft,
          nftName,
          price,
          priceFormatted,
          raisedAmountUSD,
          raisedAmountUSDFormatted,
          participants,
          participantsFormatted,
        };
      }) ?? []
    );
  }, []);

  const onRowClick = useCallback((row: NFTsTableRow) => {
    console.log('row', row);
  }, []);

  const Content = useMemo<JSX.Element>(() => {
    return (
      <Table<NFTsTableRow>
        tooltipContext={tooltipLayer}
        dSortValue="raisedAmountUSD"
        rows={rows}
        onRowClick={onRowClick}
        fields={[
          {
            label: 'NFT',
            value: 'nft',
            type: 'jsx',
            sortValue: 'nftName',
            sortType: 'string',
            widthRatio: 20,
            loaderType: 'coin_label',
          },
          {
            label: 'Participants',
            value: 'participantsFormatted',
            type: 'number',
            align: 'right',
            sortValue: 'participants',
            sortType: 'number',
            // widthRatio: 36,
          },
          {
            label: 'Fixed Price',
            value: 'priceFormatted',
            type: 'number',
            align: 'right',
            sortValue: 'price',
            sortType: 'number',
          },
          {
            label: 'Raised Amount',
            value: 'raisedAmountUSDFormatted',
            type: 'jsx',
            align: 'right',
            sortValue: 'raisedAmountUSD',
            sortType: 'number',
            widthPx: 400,
          },
        ]}
        // isLoading={isExchangesDataLoading || isExchangesMetadataLoading}
      >
        <Table.FieldRow />
      </Table>
    );
  }, [rows, tooltipLayer]);

  const { isMobile } = useUserAgent();

  return (
    <article className={`space-y-4 ${className}`}>
      <Heading tagName="h3" className="px-page_x_mobile md:px-0">
        Hot Raising
      </Heading>
      {isMobile ? Content : <Card color="glass">{Content}</Card>}
    </article>
  );
};

export default NFTsTable;
