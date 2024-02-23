import { NFT } from '@/types/asset';
import Link from 'next/link';
import NFTTumbnail from '@/components/NFTThumbnail';
import NumberText from '@/components/NumberText';
import { TokenSymbols } from '@/constants/app';
import Tag from '../Tag';

type NFTVaultLinkCardProps = {
  href: string;
  nft: NFT;
  amountLabel: string;
  formattedAmount: string;
  vaultAddress: string;
};

const NFTVaultLinkCard = ({ href, nft, amountLabel, formattedAmount, vaultAddress }: NFTVaultLinkCardProps) => {
  return (
    <Link
      href={`/${href}/${nft.collection.contractAddress}${nft.tokenId}`}
      className="group/nft-vault-link overflow-hidden Transition_500 transition-colors rounded-card_md border border-solid border-transparent hover:border-body"
    >
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-4">
          <NFTTumbnail
            size="md"
            imgSrc={nft.imgSrc}
            className="Transition_500 transition-all group-hover/nft-vault-link:scale-105"
          />
          <div className="Font_label_14px">{nft.nftName}</div>
          {nft.ownerAddress === vaultAddress && <Tag size="sm" label="Owned" />}
        </div>

        <div className="flex flex-col items-end Transition_500 transition-all group-hover/nft-vault-link:pr-3">
          <div className="Font_caption_sm">{amountLabel}</div>
          <NumberText size="lg" color="body" formattedNumber={formattedAmount} unit={TokenSymbols.INJ} />
        </div>
      </div>
    </Link>
  );
};

export default NFTVaultLinkCard;
