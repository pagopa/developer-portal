import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { GuideListsData } from '@/lib/types/guideListsData';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

export const pagoPaGuideLists: GuideListsData = {
  ...pagoPaGuideListsPath,
  product: pagoPa,
  abstract: {
    title: 'Guide e manuali',
    description:
      'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per la piattaforma pagoPA.',
  },
  guidesSections: [
    {
      title: "Per l'integrazione",
      guides: [
        {
          title: 'SACI 3.1.0',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Genera un codice IUV',
              'Comprendi la gestione delle operazioni di trasferimento fondi',
              'Crea il flusso di rendicontazione',
              'Riconcilia il flusso dei pagamenti',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/saci/latest`,
            label: 'Vai al documento',
          },
          imagePath: '/images/saci.png',
          mobileImagePath: '/images/saci-mobile.png',
        },
        {
          title: 'SANP 3.5.0',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Conosci, usa e gestisci il prodotto pagoPA',
              'Esplora i principali casi d’uso per PSP ed Enti Creditori',
              'Scopri come un Ente Creditore può aderire e integrarsi in pagoPA',
              'Scopri come un PSP può aderire e integrarsi in pagoPA',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/sanp/latest`,
            label: 'Vai al documento',
          },
          imagePath: '/images/sanp.png',
          mobileImagePath: '/images/sanp-mobile.png',
        },
      ],
    },
    {
      title: "Per l'utilizzo",
      guides: [
        {
          title: 'Manuale Back Office - EC',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Come accedere alla tua area riservata',
              "Come selezionare l'ambiente",
              'Cosa trovi nella tua nella dashboard',
              'Come utilizzare le funzionalità messe a disposizione',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/manuale-bo-ec/latest`,
            label: 'Vai al documento',
          },
          imagePath: '/images/pago-pa-manuale-bo-ec.png',
          mobileImagePath: '/images/pago-pa-manuale-bo-ec-mobile.png',
        },
        {
          title: 'Manuale Back Office - PSP',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Come accedere alla tua area riservata',
              "Come selezionare l'ambiente",
              'Cosa trovi nella tua dashboard',
              'Come utilizzare le funzionalità messe a disposizione',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/manuale-bo-psp/latest`,
            label: 'Vai al documento',
          },
          imagePath: '/images/pago-pa-manuale-bo-psp.png',
          mobileImagePath: '/images/pago-pa-manuale-bo-psp-mobile.png',
        },
        {
          title: 'Guida tecnica sugli avvisi di pagamento pagoPA',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scopri come si crea un avviso di pagamento',
              'Usa i modelli grafici per la creazione di un avviso',
              'Visualizza alcuni esempi',
              'Consulta le indicazioni per la produzione di un avviso di pagamento',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/avviso-pagamento/latest`,
            label: 'Vai alla guida',
          },
          imagePath: '/images/guida-tecnica-sugli-avvisi-di-pagamento.png',
          mobileImagePath:
            '/images/guida-tecnica-sugli-avvisi-di-pagamento-mobile.png',
        },
        {
          title: 'Linee Guida Brand pagoPA',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Utilizza correttamente il brand pagoPA',
              'Crea una campagna di sensibilizzazione',
              'Scopri come come comunicare il brand pagoPA sui social media',
              'Leggi i suggerimenti per una comunicazione efficace',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/linee-guida-brand-pagopa/latest`,
            label: 'Vai al documento',
          },
          imagePath: '/images/linee-guida-di-brand.png',
          mobileImagePath: '/images/linee-guida-di-brand-mobile.png',
        },
      ],
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};
