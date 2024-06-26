import { send } from '@/_contents/send/send';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { GuideListsData } from '@/lib/types/guideListsData';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

export const sendGuideLists: GuideListsData = {
  ...sendGuideListsPath,
  product: send,
  abstract: {
    title: 'Guide e manuali',
    description:
      'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per la piattaforma SEND.',
  },
  guidesSections: [
    {
      title: "Per l'integrazione",
      guides: [
        {
          title: 'Manuale Operativo',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Crea una notifica e monitora il suo ciclo di vita',
              'Scopri come vengono protetti i dati',
              'Scopri come funziona la piattaforma per mittenti e destinatari',
              'Scopri i canali per accedere alle notifiche',
            ],
          },
          link: {
            href: `${sendGuideListsPath.path}/manuale-operativo`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/manuale-operativo.png',
          mobileImagePath: '/images/manuale-operativo-mobile.png',
        },
        {
          title: 'Approfondimenti sull’integrazione',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Leggi domande e risposte sull’utilizzo delle API',
              'Scopri come inserire e perfezionare una notifica',
              'Scopri le modalità di validazione di una notifica',
              'Integra le spese di notifica',
            ],
          },
          link: {
            href: `${sendGuideListsPath.path}/knowledge-base`,
            label: 'Vai al documento',
          },
          imagePath: '/images/approfondimenti-sull-integrazione.png',
          mobileImagePath:
            '/images/approfondimenti-sull-integrazione-mobile.png',
        },
        {
          title: 'Modello di integrazione',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Effettua l’integrazione manualmente',
              'Effettua l’integrazione in sistemi informativi del tuo Ente e di SEND',
              'Gestisci le variazioni di costo nello stream creato',
              'Accedi utilizzando PDND',
            ],
          },
          link: {
            href: `${sendGuideListsPath.path}/modello-di-integrazione`,
            label: 'Vai al documento',
          },
          imagePath: '/images/modello-di-integrazione.png',
          mobileImagePath: '/images/modello-di-integrazione-mobile.png',
        },
      ],
    },
    {
      title: "Per l'utilizzo",
      guides: [
        {
          title: 'Kit Comunicazione',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              "Informa i cittadini dell'adesione del tuo ente a SEND",
              'Trova un supporto al tuo piano di comunicazione',
              'Personalizza i materiali grafici già pronti per le tue campagne',
              'Ottieni indicazioni sul corretto utilizzo dei loghi',
            ],
          },
          link: {
            href: `${sendGuideListsPath.path}/toolkit-comunicazione`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/kit-di-comunicazione.png',
          mobileImagePath: '/images/kit-di-comunicazione.png',
        },
      ],
    },
  ],
  bannerLinks: sendBannerLinks,
};
