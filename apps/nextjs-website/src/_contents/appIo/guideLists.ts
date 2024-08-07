import { GuideListsData } from '@/lib/types/guideListsData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIOGuideListsPath } from '@/_contents/appIo/guideListsPath';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';

export const appIoGuideLists: GuideListsData = {
  ...appIOGuideListsPath,
  product: appIo,
  abstract: {
    title: 'Guide e manuali',
    description:
      'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per l’app IO.',
  },
  guidesSections: [
    {
      title: "Per l'integrazione",
      guides: [
        {
          title: 'Guida tecnica IO',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scopri come aderire',
              'Crea e pubblica un servizio',
              'Testa e invia un messaggio',
              'Esegui test sulle funzionalità',
            ],
          },
          link: {
            href: `${appIOGuideListsPath.path}/io-guida-tecnica`,
            label: 'Vai alla guida',
          },
          imagePath: '/images/guida-tecnica.png',
          mobileImagePath: '/images/guida-tecnica-mobile.png',
        },
      ],
    },
    {
      title: "Per l'utilizzo",
      guides: [
        {
          title: 'Manuale dei servizi',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Dai il nome al servizio e scrivi la sua scheda',
              'Scopri quali e che tipo di messaggi puoi inviare',
              'Leggi le indicazioni sul tono di voce',
              'Usa i modelli dei servizi più comuni',
            ],
          },
          link: {
            href: `${appIOGuideListsPath.path}/manuale-servizi`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/manuale-dei-servizi.png',
          mobileImagePath: '/images/manuale-dei-servizi-mobile.png',
        },
        {
          title: 'I modelli dei servizi',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scopri i template dei servizi più diffusi su IO',
              'Il ciclo di vita dei servizi e i punti di contatto con il cittadino',
              'Utilizza le schede per descrivere in modo corretto il servizio',
              'Utilizza i template dei messaggi presenti per ogni servizio',
            ],
          },
          link: {
            href: `${appIOGuideListsPath.path}/modelli-servizi`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/modelli-dei-servizi.png',
          mobileImagePath: '/images/modelli-dei-servizi-mobile.png',
        },
        {
          title: 'Supporto agli Enti',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Domande e risposte su Adesione,Accordi e Assistenza',
              'Tutorial e Domande Frequenti sui Servizi',
              'Tutorial e Domande Frequenti sui Messaggi',
              'Tutorial e Domande Frequenti sui Pagamenti',
            ],
          },
          link: {
            href: `${appIOGuideListsPath.path}/supporto-agli-enti`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/app-io-supporto-enti.png',
          mobileImagePath: '/images/app-io-supporto-enti.png',
        },
        {
          title: 'Kit di comunicazione',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Crea una campagna di sensibilizzazione',
              'Usa i modelli grafici, copy e social',
              'Leggi i suggerimenti per una comunicazione efficace',
              'Raccontaci la tua esperienza',
            ],
          },
          link: {
            href: `${appIOGuideListsPath.path}/kit-comunicazione`,
            label: 'Vai al kit',
          },
          imagePath: '/images/kit-di-comunicazione.png',
          mobileImagePath: '/images/kit-di-comunicazione-mobile.png',
        },
      ],
    },
    {
      title: 'Programmi e iniziative',
      guides: [
        {
          title: 'Carta Giovani Nazionale - Documentazione Tecnica',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Accreditati come operatore',
              'Identifica i beneficiari',
              'Crea e gestisci un’agevolazione',
              'Modifica e integra le informazioni',
            ],
          },
          link: {
            href: `${appIOGuideListsPath.path}/carta-giovani-nazionale`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/documentazione-tecnica-CGN.png',
          mobileImagePath: '/images/documentazione-tecnica-CGN-mobile.png',
        },
      ],
    },
  ],
  bannerLinks: appIoBannerLinks,
};
