import { Decorator, Meta, StoryObj } from '@storybook/react';
import SolutionPreviewCard from '../../../nextjs-website/src/components/molecules/SolutionPreviewCard/SolutionsPreviewCard';
import React from 'react';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof SolutionPreviewCard> = {
  title: 'Molecules/SolutionPreviewCard',
  component: SolutionPreviewCard,
};

export default meta;

const decorator: Decorator = (story) => (
  <div style={{ padding: '40px 140px' }}>{story()}</div>
);

export const Showcase: StoryObj<typeof SolutionPreviewCard> = {
  args: {
    header: 'Soluzioni PagoPA',
    title: 'Multe per violazioni al Codice della Strada',
    description:
      'In questa guida trovi i consigli utili per erogare in maniera virtuosa il servizio di sanzioni per violazione al Codice della strada, con approfondimenti sulla gestione delle diverse fasi.',
    cta: {
      label: 'Leggi la guida completa',
      href: 'https://example.com',
    },
    steps: [
      {
        title: '01',
        content:
          'Violazione commessa dal cittadino e generazione dell’avviso pagoPA',
        products: [{ label: 'PagoPA', href: 'https://example.com' }],
      },
      {
        title: '02',
        content: 'Emissione e pagamento del preavviso di accertamento',
        products: [
          { label: 'PagoPA', href: 'https://example.com' },
          { label: 'IO', href: 'https://example.com' },
        ],
      },
      {
        title: '03',
        content: 'Emissione, consegna e pagamento del verbale di contestazione',
        products: [
          { label: 'PagoPA', href: 'https://example.com' },
          { label: 'IO', href: 'https://example.com' },
          { label: 'SEND', href: 'https://example.com' },
        ],
      },
      {
        title: '04',
        content: 'Emissione, consegna e pagamento del verbale di contestazione',
        products: [
          { label: 'PagoPA', href: 'https://example.com' },
          { label: 'IO', href: 'https://example.com' },
          { label: 'SEND', href: 'https://example.com' },
        ],
      },
    ],
  },
  decorators: [nextIntlContextDecorator, decorator],
};
