import AnimatedModal from '@/components/AnimatedModal';
import Button from '@/components/Button';
import useUserAgent from '@/hooks/useUserAgent';
import BottomSheet from '@/components/BottomSheet';
import useAccountOverlayElements, {AccountOverlayProps} from './useAccountOverlayElements';
import {useEffect} from 'react';
import router from 'next/router';

const ARIA_LABEL = 'Connected wallet account';

const AccountOverlay = (props: AccountOverlayProps) => {
  const {isOpen, onClose} = props;

  /**
   *
   * @todo replace with remote hook
   */
  useEffect(() => {
    // alternatives: routeChangeComplete
    router.events.on('routeChangeStart', onClose);
  }, [router.events, onClose]);

  const {Content, DisconnectButton} = useAccountOverlayElements(props);

  const {isMobile} = useUserAgent();

  return isMobile ? (
    <BottomSheet {...props} ariaLabel={ARIA_LABEL} className="h-[80vh] Padding_modal">
      <BottomSheet.Content>
        {Content}
        {DisconnectButton}
      </BottomSheet.Content>
    </BottomSheet>
  ) : (
    <AnimatedModal ariaLabel={ARIA_LABEL} className="h-[80vh] Padding_modal" {...props}>
      <AnimatedModal.Content isOpen={isOpen}>{Content}</AnimatedModal.Content>
      <AnimatedModal.BottomBar className="Padding_modal">{DisconnectButton}</AnimatedModal.BottomBar>
    </AnimatedModal>
  );
};

export default AccountOverlay;
