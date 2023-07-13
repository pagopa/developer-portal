import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoQuickStartGuidePath } from '@/_contents/appIo/quickStartGuidePath';
import { ComponentType } from '@/lib/enums/componentType';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';

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
            html: 'Codice HTML come un iframe o come questo: Crea un <strong>Dossier</strong> (ovvero un template per la creazione della richiesta di firma) e invia la chiamata a...',
          },
        },
        {
          componentType: ComponentType.innerHTML,
          props: {
            html:
              '<div style="position: relative; padding-bottom: calc(79.25311203319502% + 41px); height: 0; width: 100%">\n' +
              '  <iframe src="https://demo.arcade.software/hWcAEDgFao55XEhXvIJN?embed"\n' +
              '          frameBorder="0" loading="lazy"\n' +
              '          webkitallowfullscreen\n' +
              '          mozallowfullscreen\n' +
              '          allowFullScreen\n' +
              '          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;"\n' +
              '          title="PagoPA Piattaforma Self Care – App IO">\n' +
              '  </iframe>\n' +
              '</div>',
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
  bannerLinks: appIoBannerLinks,
};
