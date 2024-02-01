import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';
import Main from '@/components/Main';
import VaultsTable from '@/components/tables/VaultsTable';
import MobileAppLaunchSection from '@/components/home/MobileAppLaunchSection';
import useUserAgent from '@/hooks/useUserAgent';
import Heading from '@/components/Heading';
import VaultSearchTextInput from '@/components/form-presets/VaultSearchTextInput';
import Button from '@/components/Button';

const AsciiGlobe = dynamic(() => import('@/components/canvases/AsciiGlobe'), {
  ssr: false,
});

const Home: NextPage = () => {
  const [userWallet] = useAtom(userWalletAtom);

  const [isBalanceTokensTableLoaded, setIsBalanceTokensTableLoaded] = useState<boolean>(false);
  const onBalanceTokensTableLoaded = useCallback(() => setIsBalanceTokensTableLoaded(true), []);

  const { isMobile } = useUserAgent();
  const [isAppLaunched, setIsAppLaunched] = useState<boolean>(!isMobile);

  return (
    <>
      <AsciiGlobe className={`fixed inset-0 ${isAppLaunched ? 'hidden md:block' : ''}`} />

      {!isAppLaunched && <MobileAppLaunchSection onClickLaunch={() => setIsAppLaunched(true)} />}

      {isAppLaunched && (
        <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom">
          <Heading tagName="h1" className="flex-col items-center mx-auto my-20 text-center">
            <span>Swap big, invest wide</span>
            <span>Cross-chain trades made easy</span>
          </Heading> 

          <section className="space-y-4">
            <VaultSearchTextInput 
              label="Search token name, symbol or address"
              placeholder="Search token name, symbol or address"
              errorMsg="Valid search value is required."
              className="w-[40%] mx-auto"
            />

            <div className="flex items-center justify-center gap-x-4">
              <span className="text-primary">or</span>
              <Button color="primary" size="sm" label="Create multisig vault" iconType="arrow_forward" className="w-full md:w-fit" />
            </div>
          </section>

          <VaultsTable tooltipLayer="base" className="mt-20 md:mx-page_x" />
        </Main>
      )}
    </>
  );
};

export default Home;
