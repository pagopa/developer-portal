import { Meta, StoryObj } from '@storybook/react';
import CaseHistoryPageTemplate from '../../../nextjs-website/src/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { mockImageBlock, mockTextBlock } from '../mock-content.helper';
import { quoteMockProps } from '../atoms/Quote.stories';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof CaseHistoryPageTemplate> = {
  title: 'Templates/CaseHistoryPageTemplate',
  component: CaseHistoryPageTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof CaseHistoryPageTemplate> = {
  args: {
    title: 'Il processo di riscossione della TARI del Comune di Cagliari',
    description:
      'I cittadini possono essere notificati di eventuali multe e provvedere al pagamento attraverso Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien.',
    slug: 'il-processo-di-riscossione-della-tari-del-comune-di-cagliari',
    parts: [
      {
        component: 'blockRenderer',
        html: [
          {
            ...mockTextBlock({
              type: 'heading',
              level: 2,
              text: 'Sottotitolo',
            }),
          },
          { ...mockTextBlock() },
          { ...mockTextBlock() },
          { ...mockImageBlock() },
          {
            ...mockTextBlock({
              type: 'heading',
              level: 2,
              text: 'Sottotitolo',
            }),
          },
          { ...mockTextBlock() },
        ],
      },
      {
        component: 'quote',
        ...quoteMockProps,
      },
      {
        component: 'blockRenderer',
        html: [
          {
            ...mockTextBlock({
              type: 'heading',
              level: 2,
              text: 'Sottotitolo',
            }),
          },
          { ...mockTextBlock() },
          { ...mockTextBlock() },
          { ...mockTextBlock() },
        ],
      },
    ],
    products: [
      {
        name: 'PagoPA',
        description: 'Il portale per gli sviluppatori di PagoPA',
        slug: 'pagopa',
        logo: {
          url: 'https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg',
        },
      },
      {
        name: 'PagoPA',
        description: 'Il portale per gli sviluppatori di PagoPA',
        slug: 'pagopa',
        logo: {
          url: 'https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg',
        },
      },
      {
        name: 'PagoPA',
        description: 'Il portale per gli sviluppatori di PagoPA',
        slug: 'pagopa',
        logo: {
          url: 'https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg',
        },
      },
    ],
  },
  decorators: [nextIntlContextDecorator],
};
