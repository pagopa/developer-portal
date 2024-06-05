import { NextIntlClientProvider } from 'next-intl';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof NextIntlClientProvider>;

const NextIntlContext = (props: Props) => {
  return <NextIntlClientProvider {...props} />;
};

export default NextIntlContext;
