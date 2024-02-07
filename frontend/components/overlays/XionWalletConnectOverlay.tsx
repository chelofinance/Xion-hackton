'use client';

import { useCallback, useEffect } from 'react';
import AnimatedModal from '@/components/AnimatedModal';
import type { Wallet } from '@/types/wallet';
import type { AnimatedModalProps } from '@/components/AnimatedModal/Container';
import useUserAgent from '@/hooks/useUserAgent';
import BottomSheet from '@/components/BottomSheet';
import { Abstraxion, useAbstraxionAccount, useModal as useAbstraxionModal } from '@burnt-labs/abstraxion';
import "@burnt-labs/ui/dist/index.css";
import "@burnt-labs/abstraxion/dist/index.css";
import WaitingSymbol from '../WaitingSymbol';
import Image from 'next/image';
import BURNT_LABS_LOGO_URL from '@/resources/logos/burnt_logo.svg';

export type OnConnect = (args: { wallet: Wallet }) => void;

type XionWalletConnectOverlayProps = Omit<AnimatedModalProps, 'ariaLabel'> & {
  onConnect: OnConnect;
};

const XionWalletConnectOverlay = (props: XionWalletConnectOverlayProps) => {
  const { onConnect, onClose, isOpen } = props;

  const { data: xionAccount } = useAbstraxionAccount();

  const [, setShowAbstraxion] = useAbstraxionModal();

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout;

    if (isOpen) {
      timer = setTimeout(() => {
        setShowAbstraxion(isOpen);
      }, 4000);
    } else {
      setShowAbstraxion(isOpen);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  const onCloseAbstraxion = useCallback(() => {
    setShowAbstraxion(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (xionAccount) {
      console.log('xionAccount', xionAccount);
    }
  }, [xionAccount]);

  const Content = <div>
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex flex-col items-center gap-y-3 text-ground">
        <div className="Font_body_md">Redirecting to login</div>
        <WaitingSymbol color="white" />
      </div>

      <div className="flex items-center gap-x-1 Font_caption_xs text-primary bg-ground rounded-full px-3 py-1.5">
        <span>Powered by</span>
        <Image src={BURNT_LABS_LOGO_URL} width={20} height={20} alt="Abstraxion" />
        <span>Abstraxion</span>
      </div>
    </div>

    <Abstraxion onClose={onCloseAbstraxion} />
  </div>;

  const ARIA_LABEL = 'Select wallet';

  const { isMobile } = useUserAgent();

  return isMobile ? (
    <BottomSheet {...props} isOpen={isOpen} ariaLabel={ARIA_LABEL}>
      <BottomSheet.Content className="Padding_modal">{Content}</BottomSheet.Content>
    </BottomSheet>
  ) : (
    <AnimatedModal {...props} ariaLabel={ARIA_LABEL}>
      <AnimatedModal.Content isOpen={isOpen} className="Padding_modal">
        {Content}
      </AnimatedModal.Content>
    </AnimatedModal>
  );
};

export default XionWalletConnectOverlay;
