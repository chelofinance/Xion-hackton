import {useCallback, useMemo} from 'react';
import Table from '@/components/Table';
import Heading from '@/components/Heading';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import {formatNumber, formatUSD} from '@/utils/number';
import type {TooltipLayer} from '@/components/Tooltip/styles';
import Image from 'next/image';
import ProgressBar from '@/components/ProgressBar';
import CoinAmount from '@/components/CoinAmount';
import {TokenSymbols} from '@/constants/app';
import NFTTumbnail from '@/components/NFTThumbnail';
import CaptionAmount from '@/components/CaptionAmount';
import {useRouter} from 'next/router';

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

const HOT_NFT_DEALS: {
  id: string;
  nftName: string;
  imgSrc: string;
  price: number;
  raisedAmountUSD: number;
  participants: number;
}[] = [
    {
      id: '1',
      nftName: 'Monkey - 2004(WOOD)',
      imgSrc: 'https://images.talis.art/tokens/6582d0be4a3988d286be0f9c/mediaThumbnail',
      price: 13131313133,
      raisedAmountUSD: 11111381919,
      participants: 13133,
    },
    {
      id: '2',
      nftName: 'Injective Vandals #341',
      imgSrc: 'https://images.talis.art/tokens/65a091fb10709e02588e13da/mediaThumbnail',
      price: 22414,
      raisedAmountUSD: 4140,
      participants: 111,
    },
    {
      id: '3',
      nftName: 'Crypto Lady',
      imgSrc: 'https://talis-protocol.mo.cloudinary.net/inj/families/65b2e902e6b67bb48ef359fb/miniaturePicture',
      price: 131313,
      raisedAmountUSD: 138,
      participants: 467,
    },
  ];

const NFTsTable = ({className = '', tooltipLayer}: NFTsTableProps) => {
  const router = useRouter();

  const rows = useMemo<readonly NFTsTableRow[]>(() => {
    return (
      HOT_NFT_DEALS?.map((item) => {
        const id = String(item.id);

        const nftName = item.nftName;

        const nft = <NFTTumbnail imgSrc={item.imgSrc} name={item.nftName} />;

        const price = item.price;
        const priceFormatted = (
          <div className="flex flex-col gap-y-1 items-end">
            <CoinAmount size="md" color="body" symbol={TokenSymbols.INJ} formattedAmount={formatNumber(1112.23242, 2)} />
            <CaptionAmount size="sm" formattedAmount={formatUSD(121313111.311, {compact: true})} />
          </div>
        );

        const raisedAmountUSD = item.raisedAmountUSD;
        const raisedAmountUSDFormatted = (
          <ProgressBar
            currentNumber={raisedAmountUSD}
            targetNumber={price}
            formatOptions={{currencySymbol: '$', compact: true}}
            currentNumberCaption="raised"
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
    router.push(`/nft/${row.id}`);
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
            loaderType: 'coin_label',
            // widthRatio: 20,
          },
          {
            label: 'Fixed Price',
            value: 'priceFormatted',
            type: 'number',
            align: 'right',
            sortValue: 'price',
            sortType: 'number',
            widthRatio: 20,
          },
          {
            label: 'Participants',
            value: 'participantsFormatted',
            type: 'number',
            align: 'right',
            sortValue: 'participants',
            sortType: 'number',
            widthRatio: 20,
            // widthRatio: 36,
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

  const {isMobile} = useUserAgent();

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
