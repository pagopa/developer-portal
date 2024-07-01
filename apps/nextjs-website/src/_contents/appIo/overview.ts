import { OverviewData } from '@/lib/types/overviewData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';
import { appIoTutorials } from '@/_contents/appIo/tutorialLists';
import { appIOGuideListsPath } from '@/_contents/appIo/guideListsPath';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';
import { appIoQuickStartGuidePath } from '@/_contents/appIo/quickStartGuidePath';

export const appIoOverview: OverviewData = {
  ...appIoOverviewPath,
  product: appIo,
  hero: {
    altText: 'Hero: Raccogli i servizi del tuo ente in un unico spazio',
    backgroundImage: '/images/hero.jpg',
    title: 'Raccogli i servizi del tuo ente in un unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
  feature: {
    title: 'Perché l’app IO',
    subtitle:
      'Che tu sia un ente pubblico, centrale o locale, tramite IO potrai:',
    items: [
      {
        iconName: 'MessageRounded',
        subtitle: 'Contatta le cittadine e i cittadini in modo rapido e sicuro',
        title: 'Inviare messaggi',
      },
      {
        iconName: 'PaymentsRounded',
        subtitle: 'Invia avvisi di pagamento e riduci i tempi di incasso',
        title: 'Ottenere pagamenti',
      },
      {
        iconName: 'CreateRounded',
        subtitle:
          'Richiedi la firma digitale di documenti e contratti grazie a Firma con IO ',
        title: 'Far firmare documenti',
      },
    ],
  },
  tutorials: {
    subtitle:
      'Non sai come si manda un messaggio? Vuoi creare un servizio ma non sai da dove iniziare? Risolvi ogni dubbio con questi brevi tutorial.',
    list: appIoTutorials,
  },
  postIntegration: {
    cta: {
      label: 'Vai al manuale dei servizi',
      href: `${appIOGuideListsPath.path}/manuale-servizi`,
    },
    subtitle:
      'Scopri cosa può fare un servizio su IO e come pubblicarlo in app. Leggi il manuale dei servizi per creare un servizio da zero o personalizza uno dei tanti modelli disponibili.',
    listTitle: 'MODELLI DEI SERVIZI',
    list: [
      {
        title: 'Tassa sui rifiuti (TARI)',
        description:
          'Scheda e modelli di messaggi del servizio che invia comunicazioni in merito alla Tassa sui rifiuti (TARI)',
        path: `${appIOGuideListsPath.path}/modelli-servizi/casa-e-utenze/tassa-sui-rifiuti-tari`,
        name: 'Tassa sui rifiuti',
      },
      {
        title: "Carta d'Identità Elettronica",
        description:
          "Scheda e modelli di messaggi del servizio che riguarda la richiesta e l'emissione della Carta d'Identità Elettronica",
        path: `${appIOGuideListsPath.path}/modelli-servizi/servizi-anagrafici-e-civici/carta-didentita-elettronica`,
        name: 'CIE',
      },
      {
        title: 'Asilo Nido',
        description:
          'Scheda e modelli di messaggi del servizio che riguarda a ricezione delle comunicazioni riguardanti il sistema scolastico frequentato dai figli a carico ',
        path: `${appIOGuideListsPath.path}/modelli-servizi/educazione-e-formazione/asilo-nido`,
        name: 'Rimozione veicoli',
      },
      {
        title: 'Multe per violazioni codice della strada',
        description:
          'Scheda e modelli di messaggi del servizio che riguarda le violazioni al Codice della Strada',
        path: `${appIOGuideListsPath.path}/modelli-servizi/mobilita-e-trasporti/multe-per-violazioni-al-codice-della-strada`,
        name: 'Violazioni codice della strada',
      },
    ],
  },
  relatedLinks: [
    {
      path: `${appIOGuideListsPath.path}/modelli-servizi`,
      name: 'Consulta alcuni dei modelli utili per configurare i servizi su IO',
    },
    {
      path: `${appIOGuideListsPath.path}/supporto-agli-enti`,
      name: 'Consulta FAQ e approfondimenti nella documentazione di supporto agli Enti',
    },
    {
      path: 'https://28648410-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FZugEhXfhuchEaSiqU3p5%2Fuploads%2FygbXW3iAtEO4zjdRaFKr%2FAccordo%20di%20Adesione%20IO_v.2.4_30_giugno_2024.pdf?alt=media',
      name: 'Scarica il contratto di adesione a IO',
    },
    {
      path: `${appIOGuideListsPath.path}/kit-comunicazione`,
      name: 'Leggi kit di comunicazione',
    },
  ],
  startInfo: {
    cta: {
      text: 'Scopri tutti i dettagli dell’integrazione',
      label: 'Leggi la guida tecnica',
      href: `${appIOGuideListsPath.path}/io-guida-tecnica`,
    },
    cards: [
      {
        title: 'Quick Start',
        text: 'Aderire a IO tramite l’Area Riservata, creare un servizio, verificare l’esistenza di un utente, inviare un messaggio: ecco come si fa',
        href: `${appIoQuickStartGuidePath.path}`,
        iconName: 'FlagOutlined',
        iconColor: 'primary.dark',
      },
      {
        title: 'Documentazione API',
        text: "Esplora le API Rest per l'invio dei messaggi e la creazione di servizi sull'app IO",
        href: '/app-io/api',
        iconName: 'FolderOutlined',
        iconColor: 'primary.dark',
      },
    ],
  },
  bannerLinks: appIoBannerLinks,
};
