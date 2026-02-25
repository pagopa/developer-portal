import { Meta, StoryObj } from '@storybook/nextjs';
import SolutionListTemplate from '../../../nextjs-website/src/components/templates/SolutionListTemplate/SolutionListTemplate';

const meta: Meta<typeof SolutionListTemplate> = {
  title: 'Templates/SolutionListTemplate',
  component: SolutionListTemplate,
};

export default meta;

export const Showcase: StoryObj<typeof SolutionListTemplate> = {
  args: {
    hero: {
      backgroundImage: 'https://developer.pagopa.it/images/hero.jpg',
      altText: 'altText',
      title: 'Le soluzioni PagoPA: una nuova esperienza di servizi pubblici',
      subtitle:
        'Scopri le soluzioni, guide pratiche realizzate per supportarti nella trasformazione digitale dei tuoi servizi attraverso l’utilizzo integrato delle piattaforme PagoPA.',
    },
    solutions: [
      {
        name: 'Multe per violazioni al Codice della Strada',
        description:
          "La soluzione dedicata all’ottimizzazione dei processi legati all’intero ciclo di vita del servizio multe, dall'emissione del preavviso fino all'invio dell'eventuale contravvenzione.",
        slug: 'multe-per-violazioni-al-codice-della-strada',
        logo: {
          url: '/icons/appIo.svg',
          name: 'logo-pagopa',
          width: 200,
          height: 200,
          ext: '.svg',
          mime: 'image/svg',
        },
        tags: [{ label: 'IO' }, { label: 'PagoPA' }, { label: 'SEND' }],
      },
      {
        name: 'Multe per violazioni al Codice della Strada',
        description:
          "La soluzione dedicata all’ottimizzazione dei processi legati all’intero ciclo di vita del servizio multe, dall'emissione del preavviso fino all'invio dell'eventuale contravvenzione.",
        slug: 'multe-per-violazioni-al-codice-della-strada',
        logo: {
          url: '/icons/appIo.svg',
          name: 'logo-pagopa',
          width: 200,
          height: 200,
          ext: '.svg',
          mime: 'image/svg',
        },
        tags: [{ label: 'IO' }, { label: 'PagoPA' }, { label: 'SEND' }],
      },
    ],
    features: {
      items: [
        {
          iconName: 'MarkEmailRead',
          subtitle:
            'I cittadini hanno un accesso più diretto e immediato alle informazioni importanti e ai servizi che possono utilizzare',
          title: 'Comunicazione tempestiva e trasparente',
        },
        {
          iconName: 'MarkEmailRead',
          subtitle:
            'I cittadini hanno un accesso più diretto e immediato alle informazioni importanti e ai servizi che possono utilizzare',
          title: 'Comunicazione tempestiva e trasparente',
        },
        {
          iconName: 'MarkEmailRead',
          subtitle:
            'I cittadini hanno un accesso più diretto e immediato alle informazioni importanti e ai servizi che possono utilizzare',
          title: 'Comunicazione tempestiva e trasparente',
        },
      ],
      title: 'I benefici della trasformazione digitale dei servizi',
    },
    successStories: {
      title: 'Storie di successo',
      subtitle:
        'Le testimonianze di come gli enti hanno dato forma a servizi efficienti e accessibili, ottimizzando i processi grazie all’integrazione con le piattaforme PagoPA.',
      stories: [
        {
          title: 'Il processo di riscossione della TARI del Comune di Cagliari',
          image: {
            url: 'https://developer.pagopa.it/images/io-sign-firmare-documento.png',
            alternativeText: 'alternativeText',
          },
          publishedAt: new Date(),
          path: '/solutions/tari-comune-di-cagliari',
        },
      ],
    },
  },
};
