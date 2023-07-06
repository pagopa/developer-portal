import { OverviewData } from '@/lib/types/overviewData';
import { send } from '@/_contents/send/send';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { tutorials as sendTutorials } from '@/_contents/send/tutorials';

export const sendOverview: OverviewData = {
  ...sendOverviewPath,
  product: send,
  hero: {
    altText: 'Hero: Gestisci le notifiche in modo più semplice',
    backgroundImage: '/images/hero.jpg',
    title: 'Gestisci le notifiche in modo più semplice',
    subtitle:
      'Digitalizza e semplifica il modo in cui il tuo ente gestisce le comunicazioni a valore legale. Integrandoti con SEND, ti basterà depositare gli atti da notificare: sarà la piattaforma a occuparsi del loro invio, per via digitale o analogica.',
  },
  feature: {
    title: 'Perché usare SEND',
    subtitle:
      'Con SEND diminuisci l’incertezza della reperibilità dei destinatari e riduci i tempi e i costi di gestione. La piattaforma infatti permette al tuo ente di:',
    items: [
      {
        stackIcon: {
          icon: 'MarkEmailRead',
        },
        subtitle:
          'Tu depositi i documenti e SEND li invia, in digitale o cartaceo',
        title: 'Inviare notifiche con API o manualmente',
      },
      {
        stackIcon: {
          icon: 'QueryStats',
        },
        subtitle:
          'Visualizza la cronologia degli stati della notifica e le relative attestazioni',
        title: 'Tracciare i cambi di stato',
      },
      {
        stackIcon: {
          icon: 'TimerSharp',
        },
        subtitle:
          'Se il destinatario ha un recapito digitale, i tempi di invio sono minori',
        title: 'Diminuire i tempi di invio',
      },
      {
        stackIcon: {
          icon: 'Approval',
        },
        subtitle:
          'Il processo di notificazione è normato e c’è maggiore certezza di consegna',
        title: 'Seguire un processo normato',
      },
    ],
  },
  startCards: [
    {
      title: 'Quick Start',
      text: 'Dalla generazione di API Key all’inserimento dei dati: cinque step per inviare una notifica',
      href: '/',
      iconName: 'FlagOutlined',
    },
    {
      title: 'API B2B per le Pubbliche Amministrazioni',
      text: 'Esplora le API per per capire come inviare richieste di notifiche e ottenere informazioni',
      href: send.subpaths.api?.path ?? '#',
      iconName: 'FolderOutlined',
    },
    {
      title: 'API B2B avanzamento notifiche',
      text: 'Esplora le API per seguire il flusso di avanzamento delle notifiche',
      href: send.subpaths.api?.path ?? '#',
      iconName: 'FolderOutlined',
    },
  ],
  tutorial: {
    subtitle:
      'Quali sono le modalità di invio di una notifica? Come si segue il suo avanzamento? Risolvi ogni dubbio con questi brevi tutorial.',
    list: sendTutorials,
  },
  relatedLinks: [
    {
      path: 'https://docs.pagopa.it/f.a.q.-per-integratori/',
      name: 'Scopri approfondimenti e domande frequenti sull’integrazione con SEND',
    },
    {
      path: 'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche/',
      name: 'Consulta la documentazione sul modello di integrazione SEND',
    },
    {
      path: 'https://docs.pagopa.it/f.a.q.-per-integratori/knowledge-base-di-piattaforma-notifiche/pn-test-di-validazione-avvenuta-integrazione-con-piattaforma-notifiche',
      name: 'Scopri come documentare e validare l’avvenuta integrazione con SEND',
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: 'Scrivi un’e-mail in cui descrivi il tuo problema o dubbio all’indirizzo <strong>pn-supporto-enti@pagopa.it</strong>',
    },
  ],
};
