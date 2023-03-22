import { Homepage } from '@/domain/homepage';

export const staticHomepage: Homepage = {
  hero: {
    title:
      'Tutto ciò che serve per integrarsi con l’ecosistema di servizi PagoPA',
    cover:
      'https://images.pexels.com/photos/5053835/pexels-photo-5053835.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
  },
  highlighted: {
    title: 'In evidenza',
    references: [
      {
        type: 'quickstart',
        title: 'Prepara i documenti per la firma',
        description:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        link: '/firma-con-io/quick-start',
      },
      {
        type: 'tutorial',
        title: 'Firma con IO in 3 minuti',
        description:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        link: '#',
      },
    ],
  },
  productPreview: {
    title: 'Esplora le risorse per l’integrazione',
    preview: {
      title: 'Firma con IO',
      description:
        'Grazie a Firma con IO, i cittadini possono firmare documenti e contratti in maniera semplice, veloce e sicura direttamente tramite l’app IO. Integrandosi unicamente con questa funzionalità, gli Enti possono gestire tutti i processi di firma in un unico posto.',
      link: '/firma-con-io/panoramica',
      image: {
        src: 'https://images.unsplash.com/photo-1677324661707-3afad71c0307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
        alt: 'Immagine di Firma con IO',
      },
    },
  },
  comingSoon: {
    title: 'In arrivo su PagoPA DevPortal',
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
};
