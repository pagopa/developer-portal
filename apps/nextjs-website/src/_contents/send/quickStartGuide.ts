import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { send } from '@/_contents/send/send';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';
import { sendQuickStartGuidePath } from '@/_contents/send/quickStartGuidePath';

export const sendQuickStartGuide: QuickStartGuideData = {
  ...sendQuickStartGuidePath,
  product: send,
  abstract: {
    title: 'Quick start',
    description:
      'Se vuoi sapere cosa devi fare per integrarti, sei nel posto giusto. Con la quick start scoprirai in poco tempo tutti i passaggi che compongono il processo di integrazione.',
  },
  defaultStepAnchor: '01',
  steps: [
    {
      title: "Genera l'API Key",
      anchor: '01',
      parts: [
        {
          component: 'innerHTML',
          html: "Accedi alla <a href='https://dev.selfcare.pagopa.it/auth/login'>piattaforma Self Care</a> ed entra su SEND. In questo video troverai tutti i passaggi per generare le API Key, che <b>dovrà essere utilizzata in tutte le chiamate API</b>.",
        },
      ],
    },
    {
      title: 'Codifica i documenti in base64',
      anchor: '02',
      parts: [],
    },
    {
      title: 'Richiedi le autorizzazioni e pre-carica i documenti',
      anchor: '03',
      parts: [],
    },
    {
      title:
        'Effettua l’upload dei documenti Notifica.pdf e Pagamento.pdf su safeStorage',
      anchor: '04',
      parts: [],
    },
    {
      title: "Effettua l'inserimento della notifica",
      anchor: '05',
      parts: [],
    },
  ],
  bannerLinks: sendBannerLinks,
};
