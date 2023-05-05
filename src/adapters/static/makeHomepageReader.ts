import { HomepageReader } from '@/domain/homepage';
import * as TE from 'fp-ts/TaskEither';
import {
  ioSignOverviewPreview,
  ioSignQuickStartPreview,
  ioSignTutorialPreview,
} from './products/ioSignPages';

export const makeHomepageReader = (): HomepageReader => ({
  getPage: () =>
    TE.of({
      hero: {
        title:
          'Tutto ciò che serve per integrarsi con l’ecosistema dei servizi PagoPA',
        cover:
          'https://images.pexels.com/photos/5053835/pexels-photo-5053835.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
      },
      highlighted: {
        type: 'related-resources',
        title: 'In evidenza',
        references: [
          {
            type: 'quickstart',
            title: 'Prepara i documenti per la firma',
            description:
              'Tutti i passaggi per integrare rapidamente Firma con IO.',
            link: ioSignQuickStartPreview.link,
          },
          {
            type: 'tutorial',
            title: 'Come preparare un file PDF per la firma',
            description:
              'Un tutorial completo per realizzare un file PDF/A-2A pronto per la firma.',
            link: ioSignTutorialPreview.preview.link,
          },
        ],
      },
      productPreview: {
        title: 'Esplora le risorse per l’integrazione',
        preview: ioSignOverviewPreview.preview,
      },
      comingSoon: {
        title: 'In arrivo sul Developer Portal di PagoPA',
        items: [
          {
            title: 'IO, l’app dei servizi pubblici',
            description:
              'L’app per interagire in modo semplice e sicuro con i servizi pubblici locali e nazionali.',
          },
          {
            title: 'pagoPA, il nodo dei pagamenti',
            description:
              'La piattaforma per effettuare pagamenti verso la Pubblica Amministrazione e non solo.',
          },
          {
            title: 'Piattaforma notifiche digitali',
            description:
              'La piattaforma che consente di inviare, ricevere e gestire le comunicazioni a valore legale.',
          },
        ],
      },
    }),
});
