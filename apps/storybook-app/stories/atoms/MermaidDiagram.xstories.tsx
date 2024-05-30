import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import MermaidDiagram from '../../../nextjs-website/src/components/atoms/MermaidDiagram/MermaidDiagram';

const meta: Meta<typeof MermaidDiagram> = {
  title: 'Atoms/MermaidDiagram',
  component: MermaidDiagram,
};

export default meta;

export const Showcase: StoryObj<typeof MermaidDiagram> = {
  args: {
    chart: ''
  },
  render: (props) => (
    <NextIntlClientProvider locale="it" messages={{}}>
      <MermaidDiagram {...props} />
    </NextIntlClientProvider>)
};
