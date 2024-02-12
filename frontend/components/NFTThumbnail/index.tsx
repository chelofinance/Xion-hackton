import Card from '@/components/Card';
import Image from 'next/image';
import { useMemo } from 'react';

type NFTThumbnailSize = 'md' | 'lg' | 'xl';

const NFT_THUMBNAIL_SIZES: Record<NFTThumbnailSize, { classNames: { width: string; height: string }; pxSize: number }> = {
  md: {
    classNames: { width: 'w-32', height: 'h-32' },
    pxSize: 128,
  },
  lg: {
    classNames: { width: 'w-48', height: 'h-48' },
    pxSize: 768,
  },
  xl: {
    classNames: { width: 'w-100', height: 'h-100' },
    pxSize: 400,
  },
};

type NFTTumbnailProps = {
  imgSrc: string;
  name?: string;
  size?: NFTThumbnailSize;
  className?: string;
};

const NFTTumbnail = ({ imgSrc, name, size = 'md', className = '' }: NFTTumbnailProps) => {
  const sizes = useMemo(() => NFT_THUMBNAIL_SIZES[size], [size]);

  return (
    <section className={`${sizes.classNames.width} flex flex-col items-stretch gap-y-2 ${className}`}>
      <Card
        color="on_primary"
        className={`flex items-center justify-center ${sizes.classNames.width} ${sizes.classNames.height}`}
      >
        <Image src={imgSrc} width={sizes.pxSize} height={sizes.pxSize} alt={name ?? 'NFT thumbnail'} className="object-cover" />
      </Card>

      {name && <div className="Font_label_14px text-body truncate">{name}</div>}
    </section>
  );
};

export default NFTTumbnail;
