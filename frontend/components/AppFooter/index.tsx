import { useRef } from 'react';
import A from '@/components/A';
import Icon from '@/components/Icon';
import TermsAndPolicyButton from './TermsAndPolicyButton';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import Heading from '../Heading';
import AppLogo from '../AppLogo';
import Link from 'next/link';
import CheloLabsLogo from '../CheloLabsLogo';

const AppFooter = () => {
  const form = useRef<HTMLFormElement>(null);

  return (
    <footer className="relative grid grid-cols-1 gap-y-20 px-app_header_padding_x py-app_header_padding_y bg-primary text-ground">
      <h2 className="sr-only">Summary of the App</h2>

      <section className="flex flex-col items-start justify-between gap-x-40 gap-y-app_header_padding_y md:flex-row">
        <article className="basis-full grow shrink md:basis-1/2">
          <Heading tagName="h3" color="on_primary" className="flex items-center mb-5">
            Stay tuned <Tag label="Soon" size="sm" className="ml-2" />
          </Heading>
          <p className="Font_body_md mb-4">Join our newsletter to get notified about our newest releases.</p>

          <form ref={form} className="flex flex-col items-end gap-4 md:flex-row md:items-start">
            <TextInput
              form={form.current}
              type="email"
              label="Email to subscribe news"
              placeholder="Your email address"
              errorMsg="Valid email address is required."
              disabled
            />
            <Button color="on_primary" label="Subscribe" iconType="email" status="disabled" className="w-full md:w-fit" />
          </form>
        </article>

        <article className="basis-full grow shrink md:basis-1/2">
          <Heading tagName="h3" color="on_primary" className="mb-5">
            Explore more
          </Heading>

          <div>
            <A href="https://github.com/chelofinance">
              <Icon type="github" size="lg" className="text-ground" />
            </A>
          </div>
        </article>
      </section>

      <section className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-x-2">
          <Link href="/">
            <AppLogo color="light" />
          </Link>
          <A
            href="https://chelo.fi/"
            className="flex items-center gap-x-1 bg-ground text-primary px-2 py-1 rounded-full Font_caption_xs"
          >
            <span>by</span>
            <CheloLabsLogo size="sm" />
            <span>Chelo Labs</span>
          </A>
        </div>

        <div className="flex items-center justify-between gap-x-2">
          <div className="Font_caption_xs">© 2024 Chelo Labs</div>
          <TermsAndPolicyButton />
        </div>
      </section>
    </footer>
  );
};

export default AppFooter;
