import { OverviewData } from '@/lib/types/overviewData';
import { send } from '@/_contents/send/send';
import { sendOverviewPath } from '@/_contents/send/overviewPath';
import { sendTutorials } from '@/_contents/send/tutorialLists';
import { sendGuideListsPath } from './guideListsPath';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';
import { sendQuickStartGuidePath } from '@/_contents/send/quickStartGuidePath';
import { sendApiPath } from './apiPath';

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
  postIntegration: {
    subtitle:
      'Verifica che l’integrazione con SEND soddisfi i criteri minimi per poter operare in ambiente di staging.',
    guides: [
      {
        title: 'Validatore SEND',
        description: {
          title: 'Cosa ti permette di fare:',
          listItems: [
            'Utilizzare un’emulazione del sistema SEND',
            'Produrre un report in formato JSON sull’integrazione',
          ],
        },
        link: {
          href: `${sendGuideListsPath.path}/validatore/v1.0`,
          label: 'Scopri di più',
        },
        imagePath: '/images/validatore.png',
        mobileImagePath: '/images/validatore-mobile.png',
      },
    ],
  },
  feature: {
    title: 'Perché usare SEND',
    subtitle:
      'SEND solleva gli enti da tutti gli adempimenti legati alla gestione delle comunicazioni a valore legale e permette di ridurre tempi e costi della notificazione verso cittadini e imprese.',
    items: [
      {
        iconName: 'MarkEmailRead',
        subtitle:
          'Tu crei la richiesta e carichi gli allegati e SEND invia la notifica, digitale o cartacea',
        title: 'Invia notifiche con API o manualmente',
      },
      {
        iconName: 'QueryStats',
        subtitle:
          'Visualizza la cronologia degli stati della notifica e le relative attestazioni generate in automatico dalla piattaforma',
        title: 'Monitora i cambi di stato',
      },
      {
        iconName: 'VpnKey',
        subtitle:
          'Puoi creare le tue API key per le richieste di invio notifiche dalla piattaforma SEND. Puoi assegnarle a gruppi, ruotarle quando necessario e bloccarle se obsolete',
        title: 'Gestisci le API key',
      },
    ],
  },
  startInfo: {
    cta: {
      label: 'Leggi il manuale operativo',
      text: "Scopri i dettagli dell'integrazione",
      href: `${sendGuideListsPath.path}/manuale-operativo/v1.1.1`,
    },
    cards: [
      {
        title: 'Quick Start',
        text: 'Dalla generazione di API Key all’inserimento dei dati: cinque step per inviare una notifica',
        href: sendQuickStartGuidePath.path,
        iconName: 'FlagOutlined',
      },
      {
        title: 'API B2B per le PA',
        text: 'Esplora le API per per capire come inviare richieste di notifiche e ottenere informazioni',
        href: sendApiPath.path ?? '#',
        iconName: 'FolderOutlined',
      },
    ],
  },
  tutorials: {
    subtitle:
      'Quali sono le modalità di invio di una notifica? Come si segue il suo avanzamento? Risolvi ogni dubbio con questi brevi tutorial.',
    list: sendTutorials,
  },
  relatedLinks: [
    {
      path: `${sendGuideListsPath.path}/knowledge-base/v2.1/knowledge-base-di-piattaforma-notifiche/faq-inserimento-notifiche`,
      name: 'Scopri approfondimenti e domande frequenti sull’integrazione con SEND',
    },
    {
      path: `${sendGuideListsPath.path}/modello-di-integrazione/v2.1`,
      name: 'Consulta la documentazione sul modello di integrazione SEND',
    },
    {
      path: `${sendGuideListsPath.path}/knowledge-base/v2.1/knowledge-base-di-piattaforma-notifiche/pn-test-di-validazione-avvenuta-integrazione-con-piattaforma-notifiche`,
      name: 'Scopri come documentare e validare l’avvenuta integrazione con SEND',
    },
  ],
  bannerLinks: sendBannerLinks,
};
