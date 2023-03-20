import { ProductOverviewPage } from '@/domain/productOverviewPage';

export const staticProductOverviewPage: ProductOverviewPage = {
  title: 'Firma con IO',
  submenu: [
    {
      text: 'Panoramica',
      href: '/firma-con-io/panoramica',
    },
    {
      text: 'Quick Start',
      href: '/firma-con-io/quick-start',
    },
  ],
  hero: {
    title: 'Fai firmare documenti e contratti ai cittadini',
    description:
      'Tutti i passaggi per integrare rapidamente Firma con IO.',
    cover:
      'https://github.com/pagopa/mui-italia/blob/main/src/components/Hero/assets/hero_background.png?raw=true',
  },
  quickStart: {
    title: 'Scopri quanto è semplice integrarsi',
    description:
      'Firma con IO è una funzionalità che consente agli enti di richiedere la firma di documenti e di gestire i processi relativi in un unico posto.',
    steps: [
      {
        title: 'Prepara i documenti',
        description:
          "Prepara i documenti da inviare in firma all'utente nei formati previsti.",
      },
      {
        title: 'Crea una richiesta di firma',
        description: 'Crea un dossier contenente uno o più documenti.',
      },
      {
        title: 'Recupera il Codice Fiscale dell’utente',
        description:
          "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
      },
      {
        title: 'Invia la richiesta di firma',
        description:
          "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
      },
    ],
  },
  tutorial: {
    title: 'Esplora i tutorial',
    preview: {
      date: '13 luglio 2022',
      title: 'Scopri Firma con IO in 3 minuti',
      description:
        'Con Piattaforma Notifiche, ricevi e gestisci nello stesso spazio tutti gli atti di notifica che ti inviano Enti e Pubbliche Amministrazioni.',
      image: {
        src: 'https://images.unsplash.com/photo-1677324661707-3afad71c0307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
        alt: 'Live from space album cover',
      },
      pageRef: {
        href: '#',
        text: 'Leggi',
      },
    },
  },
};
