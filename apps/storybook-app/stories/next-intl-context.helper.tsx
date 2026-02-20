import { Decorator } from '@storybook/react';
import NextIntlContext from '../../nextjs-website/src/components/atoms/NextIntlContext/NextIntlContext';
import itMessages from '../../nextjs-website/src/messages/it.json';
import enMessages from '../../nextjs-website/src/messages/en.json';
import React from 'react';

export const nextIntlContextDecorator: Decorator = (story, context) => {
  const messages = context.args.locale === 'en' ? enMessages : itMessages;
  return (
    <NextIntlContext
      locale={(context.args.locale as string) || 'it'}
      messages={messages}
      timeZone='Europe/Rome'
    >
      {story()}
    </NextIntlContext>
  );
};
