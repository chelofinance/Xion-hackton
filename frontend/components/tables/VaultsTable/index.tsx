import { useMemo } from 'react';
import Table from '@/components/Table';
import Heading from '@/components/Heading';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import CoinLabel from '@/components/CoinLabel';
import { formatUSD } from '@/utils/number';
import A from '@/components/A';
import Icon from '@/components/Icon';
import type { TooltipLayer } from '@/components/Tooltip/styles';
import OverlayGrid from '@/components/OverlayGrid';
import { SUPPORTED_CHAINS } from '@/constants/app';
import Image from 'next/image';

type VaultsTableRow = {
  id: string;
  vault: JSX.Element;
  vaultName: string;
  icaChains: JSX.Element;
  balance: number;
  balanceFormatted: string | JSX.Element;
  vol: number;
  volFormatted: string | JSX.Element;
};

type VaultsTableProps = {
  className?: string;
  tooltipLayer: TooltipLayer;
};

const HOT_VAULTS: { id: string; vaultName: string; balance: number; vol: number }[] = [
  {
    id: 'MultiSig 1',
    vaultName: 'MultiSig 1',
    balance: 11111381919,
    vol: 3131311414141,
  },
  {
    id: 'MultiSig 2',
    vaultName: 'MultiSig 2',
    balance: 2414141414,
    vol: 1001310000,
  },
  {
    id: 'MultiSig 3',
    vaultName: 'MultiSig 3',
    balance: 138242421919,
    vol: 11000000,
  },
];

const VaultsTable = ({ className = '', tooltipLayer }: VaultsTableProps) => {
  // const { data: exchangesData, isLoading: isExchangesDataLoading } = useCMCExchangesQuery({ limit: 5 });

  // const ids = useMemo<readonly number[]>(() => {
  //   return exchangesData?.map((item) => item.id) ?? [];
  // }, [exchangesData]);

  // const { data: exchangesMetadata, isLoading: isExchangesMetadataLoading } = useCMCExchangesMetadataQuery(ids);

  const rows = useMemo<readonly VaultsTableRow[]>(() => {
    return (
      HOT_VAULTS?.map((item) => {
        const id = String(item.id);
        const vault = (
          <A href={`/vault/${id}`} className="flex items-center gap-x-1">
            <CoinLabel size="lg" symbol={item.id} logoURL={''} />
            <Icon type="external_link" size="md" className="text-caption_dark" />
          </A>
        );

        const vaultName = item.vaultName;

        const icaChains = (
          <OverlayGrid xUnitPx={16} className="!w-10">
            {SUPPORTED_CHAINS.slice(1).map((supportedChain) => (
              <OverlayGrid.Item key={supportedChain.name}>
                <Image
                  src={supportedChain.logoURL ?? ''}
                  width={24}
                  height={24}
                  alt={supportedChain.name}
                  className="rounded-full overflow-hidden border border-solid border-primary_line_light"
                />
              </OverlayGrid.Item>
            ))}
          </OverlayGrid>
        );

        const balance = item.balance;
        const balanceFormatted = formatUSD(balance, { compact: true });

        const vol = item.vol;
        const volFormatted = formatUSD(vol, { compact: true });

        return {
          id,
          vault,
          vaultName,
          icaChains,
          balance,
          balanceFormatted,
          vol,
          volFormatted,
        };
      }) ?? []
    );
  }, []);

  const Content = useMemo<JSX.Element>(() => {
    return (
      <Table<VaultsTableRow>
        tooltipContext={tooltipLayer}
        dSortValue="vol24H"
        rows={rows}
        fields={[
          {
            label: 'Multisig Vault',
            value: 'vault',
            type: 'jsx',
            sortValue: 'vaultName',
            sortType: 'string',
            widthRatio: 30,
            loaderType: 'coin_label',
          },
          {
            label: 'ICA Chains',
            value: 'icaChains',
            type: 'jsx',
            sortValue: 'vaultName',
            sortType: 'string',
            widthRatio: 20,
            loaderType: 'coin_label',
            tooltipContent: 'The chains this vault has ICAs, Inter-chain Account, on',
          },
          {
            label: 'Balance',
            value: 'balanceFormatted',
            type: 'number',
            align: 'right',
            sortValue: 'balance',
            sortType: 'number',
            widthRatio: 12,
          },
          {
            label: 'Transaction Amount',
            value: 'volFormatted',
            type: 'number',
            align: 'right',
            sortValue: 'vol',
            sortType: 'number',
            // widthRatio: 36,
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
        Hot Multisig Vaults
      </Heading>
      {isMobile ? Content : <Card color="glass">{Content}</Card>}
    </article>
  );
};

export default VaultsTable;
