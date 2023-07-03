import { send } from '@/_contents/send/send';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { GuideListsData } from '@/lib/types/guideListsData';

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
              'Il processo di creazione e la timeline di una notifica e degli atti prodotti',
              'Come vengono protetti i dati',
              'Mittenti e destinatari delle notifiche',
              'Altri modi per accedere alle notifiche',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/manuale-operativo.png',
          mobileImagePath: '/images/manuale-operativo-mobile.png',
        },
        {
          title: 'Knowledge-base di Piattaforma Notifiche',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Domande e risposte sull’utilizzo delle API',
              'Come inserire e perfezionare una notifica',
              'Le modalità di validazione di una notifica',
              'Come integrare le spese di notifica',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/approfondimenti-integrazione.png',
          mobileImagePath: '/images/approfondimenti-integrazione-mobile.png',
        },
        {
          title: 'Modello di integrazione di Piattaforma Notifiche Digitali',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Come integrarsi manualmente',
              'Come integrare in sistemi informativi dell’ente e quelli di Piattaforma Notifiche',
              'Come gestire le variazioni di costo nello stream creato',
              'Come accedere utilizzando PDND',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai alla guida',
          },
          imagePath: '/images/modello-integrazione.png',
          mobileImagePath: '/images/modello-integrazione-mobile.png',
        },
      ],
    },
  ],
};
