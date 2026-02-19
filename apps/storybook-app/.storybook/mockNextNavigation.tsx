import React from 'react';
import { setMockParams } from './nextNavigationProxy';

export function withMockedParams(locale = 'it') {
  setMockParams({ locale });
  return (Story: any) => <Story />;
}
