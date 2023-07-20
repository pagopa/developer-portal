import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoQuickStartGuidePath } from '@/_contents/appIo/quickStartGuidePath';
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
          component: 'typography',
          text: 'paragrafo di testo senza particolari formattazioni',
        },
        {
          component: 'apiTester',
          apiCall: {
            code:
              '{\n' +
              '  "id": "01GG4NFBCN4ZH8ETCCKX3766KX",\n' +
              '  "title": "Contratto 150 ore",\n' +
              '  "documents": [\n' +
              '    {\n' +
              '      "title": "Contratto",\n' +
              '      "signature_fields": [\n' +
              '        {\n' +
              '          "unique_name": "Signature1",\n' +
              '          "clause": {\n' +
              '            "title": "Firma contratto",\n' +
              '            "type": "REQUIRED"\n' +
              '          }\n' +
              '        }\n' +
              '      ]\n' +
              '    }\n' +
              '  ]\n' +
              '}\n',
            language: 'json',
            parts: [
              {
                component: 'typography',
                text: 'Invia la richiesta per vedere la risposta del server.',
                variant: 'body2',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Nome del Dossier',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'Contratto 150 ore',
              },
            ],
          },
          apiResponse: {
            code: '{\n' + '  "fiscal_code": "AAABBB00A00A000"\n' + '}',
            language: 'json',
            parts: [
              {
                component: 'innerHTML',
                html: "Ecco la risposta del server contenente l'ID del Cittadino, che ti servirà nel prossimo step.",
              },
            ],
          },
        },
        {
          component: 'alert',
          severity: 'info',
          text: 'Testo del warning',
          title: 'Titolo del warning',
        },
      ],
    },
    {
      title: 'Crea un servizio',
      anchor: '02',
      parts: [
        {
          component: 'innerHTML',
          html: 'Codice HTML come un iframe o come questo: Crea un <strong>Dossier</strong> (ovvero un template per la creazione della richiesta di firma) e invia la chiamata a...',
        },
        {
          component: 'innerHTML',
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
        {
          component: 'codeBlock',
          code:
            'const user = {\n' +
            '  firstName: "Angela",\n' +
            '  lastName: "Davis",\n' +
            '  role: "Professor",\n' +
            '}\n' +
            ' \n' +
            'console.log(user.name)',
          language: 'typescript',
        },
        {
          component: 'typography',
          text: 'paragrafo di testo senza particolari formattazioni',
        },
      ],
    },
  ],
  bannerLinks: appIoBannerLinks,
};
