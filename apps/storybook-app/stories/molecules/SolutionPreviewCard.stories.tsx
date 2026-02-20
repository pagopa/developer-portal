import { Decorator, Meta, StoryObj } from '@storybook/nextjs';
import SolutionPreviewCard from '../../../nextjs-website/src/components/molecules/SolutionPreviewCard/SolutionsPreviewCard';
import React from 'react';
import { Box } from '@mui/material';

const meta: Meta<typeof SolutionPreviewCard> = {
  title: 'Molecules/SolutionPreviewCard',
  component: SolutionPreviewCard,
};

export default meta;

const decorator: Decorator = (story) => (
  <Box sx={{ padding: { md: '40px 140px' } }}>{story()}</Box>
);

export const Showcase: StoryObj<typeof SolutionPreviewCard> = {
  args: {
    header: 'Soluzioni PagoPA',
    title: 'Multe per violazioni al Codice della Strada',
    description:
      'In questa guida trovi i consigli utili per erogare in maniera virtuosa il servizio di sanzioni per violazione al Codice della strada, con approfondimenti sulla gestione delle diverse fasi.',
    cta: {
      label: 'Scopri di più',
      href: 'https://example.com',
    },
    steps: [
      {
        title: '01',
        content: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Violazione commessa dal cittadino e generazione dell’avviso pagoPA',
              },
            ],
          },
        ],
        products: [{ label: 'PagoPA', href: 'https://example.com' }],
      },
      {
        title: '02',
        content: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Emissione e pagamento del preavviso di accertamento',
              },
            ],
          },
        ],
        products: [
          { label: 'PagoPA', href: 'https://example.com' },
          { label: 'IO', href: 'https://example.com' },
        ],
      },
      {
        title: '03',
        content: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Emissione, consegna e pagamento del verbale di contestazione',
              },
            ],
          },
        ],
        products: [
          { label: 'PagoPA', href: 'https://example.com' },
          { label: 'IO', href: 'https://example.com' },
          { label: 'SEND', href: 'https://example.com' },
        ],
      },
      {
        title: '04',
        content: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Emissione, consegna e pagamento del verbale di contestazione',
              },
            ],
          },
        ],
        products: [
          { label: 'PagoPA', href: 'https://example.com' },
          { label: 'IO', href: 'https://example.com' },
          { label: 'SEND', href: 'https://example.com' },
        ],
      },
    ],
  },
  decorators: [decorator],
};
