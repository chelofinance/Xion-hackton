import {useCallback, useMemo} from 'react';
import Table from '@/components/Table';
import Heading from '@/components/Heading';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import {formatNumber, formatUSD, simpleFormat} from '@/utils/number';
import type {TooltipLayer} from '@/components/Tooltip/styles';
import ProgressBar from '@/components/ProgressBar';
import CoinAmount from '@/components/CoinAmount';
import NFTTumbnail from '@/components/NFTThumbnail';
import CaptionAmount from '@/components/CaptionAmount';
import useOraclePrice from '@/hooks/useOraclePrice';
import BigNumber from 'bignumber.js';
import {useRouter} from 'next/router';
import useRaisingNFTVaults from '@/hooks/useRaisingNFTVaults';
import {COIN_DICT, TokenSymbols} from '@/constants/app';
import useMyVaults from '@/hooks/useMyVaults';
import {useAtom} from 'jotai';
import {userWalletAtom} from '@/store/states';

type NFTsTableRow = {
  id: string;
  nft: JSX.Element;
  nftName: string;
  price: number;
  priceFormatted: string | JSX.Element;
  raisedAmountUSD: BigNumber;
  raisedAmountUSDFormatted: string | JSX.Element;
  participants: number;
  participantsFormatted: string | JSX.Element;
};

type NFTsTableProps = {
  className?: string;
  tooltipLayer: TooltipLayer;
};

const coin = COIN_DICT[TokenSymbols.INJ];

const NFTsTable = ({className = '', tooltipLayer}: NFTsTableProps) => {
  const {getOraclePrice} = useOraclePrice();
  const [userWallet] = useAtom(userWalletAtom);
  const {myVaults, updateMyVaults} = useMyVaults(userWallet?.account.bech32Address);
  const nfts = useRaisingNFTVaults();

  const rows = useMemo<readonly NFTsTableRow[]>(() => {
    return (
      nfts
        .filter((nft) => nft.onSale)
        .map((item) => {
          const id = `${item.collection.contractAddress}${item.tokenId}`;

          const nftName = item.nftName;

          const nft = <NFTTumbnail imgSrc={item.imgSrc} name={item.nftName} />;

          const oraclePrice = getOraclePrice(item.fixedPrice.symbol);

          const price = item.fixedPrice.value.div(10 ** coin.decimals).toNumber(); //price must be rounded down given decimals
          const priceUSD = new BigNumber(price).times(oraclePrice);
          const priceFormatted = (
            <div className="flex flex-col gap-y-1 items-end">
              <CoinAmount size="md" color="body" symbol={item.fixedPrice.symbol} formattedAmount={formatNumber(price, 6)} />
              <CaptionAmount size="sm" formattedAmount={formatUSD(priceUSD, {compact: true})} />
            </div>
          );

          const raisedAmountUSD = new BigNumber(item.raisedAmount).times(oraclePrice);
          const raisedAmountUSDFormatted = (
            <ProgressBar
              currentNumber={raisedAmountUSD.toNumber()}
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
  }, [nfts.length]);

  const router = useRouter();

  const onRowClick = useCallback(
    (row: NFTsTableRow) => {
      const vault = router.query.vault || myVaults.length > 0 ? myVaults[0].multisigAddress : '';
      router.push(`/raising-vault/${row.id}?vault=${vault}`);
    },
    [router]
  );

  const Content = useMemo<JSX.Element>(() => {
    return (
      <Table<NFTsTableRow>
        hasMouseEffect={true}
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
            sortType: 'bignumber',
            widthPx: 400,
          },
        ]}
      //isLoading={isExchangesDataLoading || isExchangesMetadataLoading}
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
