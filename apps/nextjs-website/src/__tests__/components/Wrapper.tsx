import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

import messages from '@/messages/it.json';

const Wrapper = ({ children }: PropsWithChildren) => (
  <NextIntlClientProvider locale={'it'} messages={messages}>
    {children}
  </NextIntlClientProvider>
);

export default Wrapper;
