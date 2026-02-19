import React from 'react';
import { setMockParams } from './next-navigation-proxy';

export function withMockedParams(locale = 'it') {
  setMockParams({ locale });
  return (Story: any) => <Story />;
}
