import { Decorator } from '@storybook/react';
import AuthProvider from '../../nextjs-website/src/components/organisms/Auth/AuthProvider';
import React from 'react';

export const authProviderDecorator: Decorator = (story) => (
  <AuthProvider>{story()}</AuthProvider>
);
