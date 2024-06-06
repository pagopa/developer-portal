import { Decorator } from '@storybook/react';
import NextIntlContext from '../../nextjs-website/src/components/atoms/NextIntlContext/NextIntlContext';
import messages from '../../nextjs-website/src/messages/it.json';
import React from 'react';

export const nextIntlContextDecorator: Decorator = (story) => (
  <NextIntlContext locale={'it'} messages={messages} timeZone='Europe/Rome'>
    {story()}
  </NextIntlContext>
);
