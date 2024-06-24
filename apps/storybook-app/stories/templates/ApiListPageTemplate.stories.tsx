import { Meta, StoryObj } from '@storybook/react';
import ApiListPageTemplate from '../../../nextjs-website/src/components/templates/ApiListPageTemplate/ApiListPageTemplate';
import { nextIntlContextDecorator } from '../next-intl-context.helper';

const meta: Meta<typeof ApiListPageTemplate> = {
  title: 'Templates/ApiListPageTemplate',
  component: ApiListPageTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof ApiListPageTemplate> = {
  decorators: [nextIntlContextDecorator],
  args: {
    breadcrumbs: {
      product: {
        name: 'Piattaforma pagoPA',
        description: 'Il portale per gli sviluppatori di PagoPA',
        slug: 'pagopa',
        logo: {
          url: 'https://cdn.dev.developer.pagopa.it/app_Io_d9bffd556b.svg',
        },
        subpaths: {
          overview: {
            name: 'api',
            path: 'api',
          },
        },
      },
      path: 'PagoPA',
      paths: [
        {
          name: 'API',
          path: 'API',
        },
      ],
    },
    hero: {
      title: 'API',
      subtitle:
        'Se vuoi sapere come iscriverti a un e-service partendo dal catalogo e ottenere un voucher per la fruizione del sevizio.',
    },
    cards: [
      {
        title: 'Gestione posizioni debitorie',
        text: 'API per la creazione, aggiornamento e cancellazione delle posizioni debitorie ad uso di Partner Tecnologici, Intermediari Tecnologici ed Enti Creditori.',
        icon: 'code',
        ctaLabel: 'Esplora le API',
        tags: [
          {
            label: 'REST',
          },
        ],
      },
      {
        title: 'Documentazione SOAP',
        text: 'La documentazione in cui è possibile consultare tutti gli schemi XSD e WSDL che seguono le diverse release SANP.',
        icon: 'code',
        ctaLabel: 'Esplora le API',
        tags: [
          {
            label: 'SOAP',
          },
        ],
      },
      {
        title: 'Stampa Avvisi di Pagamento',
        text: 'API native della piattaforma pagoPA per permettere ad Enti / Intermediari / Partner Tecnologici la stampa in self service degli avvisi di pagamento',
        icon: 'code',
        ctaLabel: 'Esplora le API',
        tags: [
          {
            label: 'REST',
          },
        ],
      },
      {
        title: 'Flussi di rendicontazione',
        text: 'API REST .... , creare un servizio, verificare l’esistenza di un utente, inviare un messaggio e molto altro.',
        icon: 'code',
        ctaLabel: 'Esplora le API',
        tags: [
          {
            label: 'REST',
          },
        ],
      },
    ],
  },
};
