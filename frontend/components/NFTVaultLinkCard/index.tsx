import { NFTVault } from '@/types/asset';
import Link from 'next/link';
import NFTTumbnail from '@/components/NFTThumbnail';
import NumberText from '@/components/NumberText';

type NFTVaultLinkCardProps = {
  href: string;
  nftVault: NFTVault;
  amountLabel: string;
  formattedAmount: string;
};

const NFTVaultLinkCard = ({ href, nftVault, amountLabel, formattedAmount }: NFTVaultLinkCardProps) => {
  return (
    <Link
      href={`/${href}/${nftVault.collection.contractAddress}${nftVault.tokenId}`}
      className="group/nft-vault-link overflow-hidden Transition_500 transition-colors rounded-card_md border border-solid border-transparent hover:border-ground"
    >
      <div className="flex items-center justify-between gap-x-4">
        <NFTTumbnail
          size="sm"
          imgSrc={nftVault.imgSrc}
          className="Transition_500 transition-all group-hover/nft-vault-link:scale-105"
        />

        <div className="flex flex-col items-end Transition_500 transition-all group-hover/nft-vault-link:pr-3">
          <div className="Font_caption_xs">{amountLabel}</div>
          <NumberText color="on_primary" formattedNumber={formattedAmount} />
        </div>
      </div>
    </Link>
  );
};

export default NFTVaultLinkCard;
