import type {NextPage} from 'next';
import dynamic from 'next/dynamic';
import {useCallback, useState} from 'react';
import Main from '@/components/Main';
import NFTsTable from '@/components/tables/NFTsTable';
import MobileAppLaunchSection from '@/components/home/MobileAppLaunchSection';
import useUserAgent from '@/hooks/useUserAgent';
import Heading from '@/components/Heading';
import VaultSearchTextInput from '@/components/form-presets/VaultSearchTextInput';
import Button from '@/components/Button';
import {useRouter} from 'next/router';
import { useAtom } from 'jotai';
import { userWalletAtom } from '@/store/states';

const AsciiGlobe = dynamic(() => import('@/components/canvases/AsciiGlobe'), {
  ssr: false,
});

const Home: NextPage = () => {
  const { isMobile } = useUserAgent();
  const [isAppLaunched, setIsAppLaunched] = useState<boolean>(!isMobile);

  const router = useRouter();
  // const onClickCreateVault = useCallback(() => router.push('/create-vault'), []);

  const [userWallet] = useAtom(userWalletAtom);

  return (
    <>
      <AsciiGlobe className={`fixed inset-0 ${isAppLaunched ? 'hidden md:block' : ''}`} />

      {!isAppLaunched && <MobileAppLaunchSection onClickLaunch={() => setIsAppLaunched(true)} />}

      {isAppLaunched && (
        <Main className="flex flex-col items-stretch min-h-screen pt-app_header_height pb-page_bottom">
          <Heading tagName="h1" className="flex-col items-center mx-auto my-20 text-center">
            <span>Trade arts like a pro</span>
            <span>Cross-chain trades made easy</span>
          </Heading>

          {userWallet !== null && <div className="flex justify-center items-center gap-x-2">
            <Button 
              type="outline"
              label="See my vaults"
              iconType="arrow_forward"
              onClick={() => router.push('/my-vaults')}
            />
            <Button 
              label="Create vault"
              iconType="arrow_forward"
              onClick={() => router.push('/create-vault')}
            />
          </div>}

          {/* <section className="space-y-4">
            <VaultSearchTextInput
              label="Search NFT name, or address"
              placeholder="Search NFT name, or address"
              getErrorMsg={() => 'Valid search value is required.'}
              className="w-[40%] mx-auto"
            />

            <div className="flex items-center justify-center gap-x-4">
              <span className="text-primary">or</span>
              <Button
                color="primary"
                size="sm"
                label="Create vault"
                iconType="arrow_forward"
                className="w-full md:w-fit"
                onClick={onClickCreateVault}
              />
            </div>
          </section> */}

          <NFTsTable tooltipLayer="base" className="mt-20 md:mx-page_x" />
        </Main>
      )}
    </>
  );
};

export default Home;
