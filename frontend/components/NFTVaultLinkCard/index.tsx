import { NFT } from '@/types/asset';
import Link from 'next/link';
import NFTTumbnail from '@/components/NFTThumbnail';
import NumberText from '@/components/NumberText';
import { TokenSymbols } from '@/constants/app';
import Tag from '../Tag';
import Icon from '../Icon';
import { TextColor } from '../styles';

type NFTVaultLinkCardColor = 'on_primary' | 'body';

type NFTVaultLinkCardProps = {
  href: string;
  nft: NFT;
  amountLabel: string;
  formattedAmount: string;
  vaultAddress: string;
  color?: NFTVaultLinkCardColor;
};

const COLOR_DICT: Record<NFTVaultLinkCardColor, { border: string; text: TextColor }> = {
  on_primary: { border: 'border-ground', text: 'on_primary' },
  body: { border: 'border-primary_line_light', text: 'body' },
};

const NFTVaultLinkCard = ({ href, nft, amountLabel, formattedAmount, vaultAddress, color = 'on_primary' }: NFTVaultLinkCardProps) => {
  const colors = COLOR_DICT[color];

  return (
    <Link
      href={`/${href}/${nft.collection.contractAddress}${nft.tokenId}`}
      className={`group/nft-vault-link overflow-hidden Transition_500 transition-colors rounded-card_md border border-solid ${colors.border}`}
    >
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <NFTTumbnail
            size="md"
            imgSrc={nft.imgSrc}
            className="Transition_500 transition-all group-hover/nft-vault-link:scale-105"
          />

          <div className="flex flex-col gap-y-1">
            <div className="Font_label_14px">{nft.nftName}</div>
            <div className="w-[200px] h-6 Font_caption_xs truncate">{nft.description}</div>
            {/* {nft.ownerAddress === vaultAddress && <Tag size="sm" label="Owned" />} */}

            <div className="flex items-baseline gap-x-2">
              <div className="Font_caption_xs">{amountLabel}</div>
              <NumberText size="lg" color={colors.text} formattedNumber={formattedAmount} unit={TokenSymbols.INJ} />
            </div>
          </div>
        </div>

        <Icon type="arrow_forward" size="md" className="Transition_500 transition-all group-hover/nft-vault-link:-translate-x-2 mr-4" />
      </div>
    </Link>
  );
};

export default NFTVaultLinkCard;
