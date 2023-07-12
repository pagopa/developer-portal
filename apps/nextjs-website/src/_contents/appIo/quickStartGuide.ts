import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoQuickStartGuidePath } from '@/_contents/appIo/quickStartGuidePath';
import { ComponentType } from '@/lib/enums/componentType';

export const appIoQuickStartGuide: QuickStartGuideData = {
  ...appIoQuickStartGuidePath,
  product: appIo,
  abstract: {
    title: 'Quick start',
    description:
      'Se vuoi sapere cosa devi fare per integrarti, sei nel posto giusto. Con la quick start scoprirai in poco tempo tutti i passaggi che compongono il processo di integrazione.',
  },
  defaultStepAnchor: '01',
  steps: [
    {
      title: "Aderisci tramite l'Area Riservata",
      anchor: '01',
      parts: [
        {
          componentType: ComponentType.typography,
          props: {
            text: 'paragrafo di testo senza particolari formattazioni',
          },
        },
      ],
    },
    {
      title: 'Crea un servizio',
      anchor: '02',
      parts: [
        {
          componentType: ComponentType.innerHTML,
          props: {
            innerHtml:
              'Codice HTML come un iframe o come questo: Crea un <strong>Dossier</strong> (ovvero un template per la creazione della richiesta di firma) e invia la chiamata a...',
          },
        },
        {
          componentType: ComponentType.codeBlock,
          props: {
            code: 'Code snippet: POST /api/v1/sign/dossiers',
          },
        },
        {
          componentType: ComponentType.typography,
          props: {
            text: 'paragrafo di testo senza particolari formattazioni',
          },
        },
      ],
    },
  ],
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo <strong>onboarding@io.italia.it</strong>",
    },
    {
      theme: 'light',
      title: 'Dicci cosa ne pensi',
      decoration: 'Feedback',
      body: 'Per segnalare problemi o dare feedback, lascia un commento nello <strong>spazio GitHub</strong> dellapp IO',
    },
  ],
};
