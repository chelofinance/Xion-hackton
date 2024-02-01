import Image from 'next/image';
import CHELO_LABS_LOGO from '@/resources/logos/chelo_labs_logo.png';

type CheloLabsLogoSize = 'sm' | 'md' | 'lg';

const LOGO_SIZE_CLASS_DICT: Record<CheloLabsLogoSize, { className: string; px: number }> = {
  sm: { className: 'w-4', px: 16 },
  md: { className: 'w-10', px: 40 },
  lg: { className: 'w-14', px: 56 },
};

type CheloLabsLogoProps = {
  size?: CheloLabsLogoSize;
};

const CheloLabsLogo = ({ size = 'md' }: CheloLabsLogoProps) => {
  const imgSize = LOGO_SIZE_CLASS_DICT[size];

  return <Image priority src={CHELO_LABS_LOGO.src} alt="App logo" width={imgSize.px} height={imgSize.px} className={imgSize.className} />;
};

export default CheloLabsLogo;
