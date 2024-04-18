import { OverviewData } from '@/lib/types/overviewData';
import { pdnd } from '@/_contents/pdnd/pdnd';
import { pdndOverviewPath } from '@/_contents/pdnd/overviewPath';
import { pdndTutorials } from '@/_contents/pdnd/tutorialLists';
import { pdndBannerLinks } from '@/_contents/pdnd/bannerLinks';
import { pdndQuickStartGuidePath } from '@/_contents/pdnd/quickStartGuidePath';

export const pdndOverview: OverviewData = {
  ...pdndOverviewPath,
  product: pdnd,
  hero: {
    altText:
      'La piattaforma che abilita lo scambio di informazioni tra gli enti',
    backgroundImage: '/images/hero.jpg',
    title: 'La piattaforma che abilita lo scambio di informazioni tra gli enti',
    subtitle:
      'PDND Interoperabiltà rende semplice e sicuro lo scambio di informazioni tramite un processo standard. Come? Su PDND Interoperabilità, ogni erogatore può integrare i servizi che gestisce e richiedere la fruizione di quelli di cui ha bisogno.',
  },
  feature: {
    title: 'Perché PDND Interoperabilità',
    subtitle: '',
    items: [
      {
        iconName: 'MessageRounded',
        subtitle:
          'Offre un solo catalogo di servizi consultabile da tutti gli aderenti',
        title: 'Unica',
      },
      {
        iconName: 'PaymentsRounded',
        subtitle:
          'Crea un canale sicuro per autenticare e autorizzare erogatori e fruitori dei servizi ad accedere alle informazioni delle quali hanno bisogno',
        title: 'Sicura',
      },
      {
        iconName: 'CreateRounded',
        subtitle:
          'Semplifica l’iter amministrativo e riduce i tempi di accesso alle informazioni',
        title: 'Veloce',
      },
    ],
  },
  tutorials: {
    subtitle:
      'Vuoi scoprire cos’è una Finalità su PDND Interoperabilità? Vuoi capire come mettere un servizio a disposizione di altri enti? Questi tutorial possono aiutarti.',
    list: pdndTutorials,
  },
  relatedLinks: [
    {
      path: 'https://trasparenza.agid.gov.it/archivio28_provvedimenti-amministrativi_0_123064_725_1.html',
      name: 'Linee guida PDND Interoperabilità redatte da AgID e aggiornamento a maggio 2023',
    },
    {
      path: 'https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9732758',
      name: 'Parere del Garante per la Protezione dei Dati Personali',
    },
    {
      path: 'https://developers.italia.it/it/pdnd/',
      name: 'PDND - Piattaforma Digitale Nazionale Dati',
    },
    {
      path: 'https://next.developers.italia.it/it/interoperabilita/',
      name: 'Ecosistema Interoperabilità',
    },
    {
      path: 'https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2005-05-16&atto.codiceRedazionale=005G0104&atto.articolo.numero=0&atto.articolo.sottoArticolo=1&atto.articolo.sottoArticolo1=10&qId=5614860b-4769-478e-bf22-a8a76a04159a&tabID=0.5538263478162919&title=lbl.dettaglioAtto',
      name: 'Articolo 50-ter',
    },
  ],
  startInfo: {
    cards: [
      {
        title: 'Quick Start',
        text: 'Scopri come iscriverti a un e-service partendo dal catalogo e ottenere un voucher per la fruizione del sevizio.',
        href: `${pdndQuickStartGuidePath.path}`,
        iconName: 'FlagOutlined',
      },
      {
        title: 'Manuale operativo',
        text: 'Approfondisci tutti i dettagli di PDND Interoperabilità, dall’adesione alla piattaforma, alla creazione e gestione di un e-service.',
        href: '/pdnd-interoperabilita/guides/manuale-operativo',
        iconName: 'MenuBook',
      },
    ],
  },
  bannerLinks: pdndBannerLinks,
};
