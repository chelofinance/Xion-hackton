"use client";

import { useEffect } from 'react';
import AnimatedModal from '@/components/AnimatedModal';
import type { Wallet } from '@/types/wallet';
import type { AnimatedModalProps } from '@/components/AnimatedModal/Container';
import useUserAgent from '@/hooks/useUserAgent';
import BottomSheet from '@/components/BottomSheet';
import { Abstraxion, useAbstraxionAccount } from '@burnt-labs/abstraxion';

export type OnConnect = (args: { wallet: Wallet; }) => void;

type XionWalletConnectOverlayProps = Omit<AnimatedModalProps, 'ariaLabel'> & {
  onConnect: OnConnect;
};

const XionWalletConnectOverlay = (props: XionWalletConnectOverlayProps) => {
  const { onConnect, onClose, isOpen } = props;

  const { data: xionAccount } = useAbstraxionAccount();

  useEffect(() => {
    if (xionAccount) {
      console.log("xionAccount", xionAccount);
    }
  }, [xionAccount]);

  const Content = (
    <Abstraxion
        isOpen={isOpen}
        onClose={onClose}
    />
  );

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
