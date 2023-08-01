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
      title: 'Aderisci tramite Self Care',
      anchor: '01',
      parts: [
        {
          component: 'innerHTML',
          html: "Prima di poter utilizzare le API di IO, il tuo ente dovrà avere un'adesione base attiva. Se non la possiede, il primo passo è quello di eseguire il processo di <a href='https://selfcare.pagopa.it/auth/login?onSuccess=%2Fonboarding%2Fprod-io'>onboarding ad App IO</a> tramite Self Care.",
        },
      ],
    },
    {
      title: 'Crea un servizio',
      anchor: '02',
      parts: [
        {
          component: 'typography',
          text: 'Segui i passaggi indicati nel video interattivo per scoprire come creare un servizio destinato ai cittadini e generare l’API-key che ti servirà per chiamare tutte le API di IO.',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/vzSmyIz00g6JlozGlG3k?embed" \n` +
            `    frameborder="0" \n` +
            `    loading="lazy" \n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="PagoPA Piattaforma Self Care -- App IO"  \n` +
            `  /> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Verifica l’esistenza dell’utente',
      anchor: '03',
      parts: [
        {
          component: 'typography',
          text: 'Una volta creato il servizio, prima di inviare il messaggio dovrai verificare l’esistenza del codice fiscale dell’utente inviando la chiamata al seguente  endpoint:',
        },
        {
          component: 'codeBlock',
          code: "POST 'https://api.io.pagopa.it/api/v1/profiles'",
          language: 'txt',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code: '{\n' + '  "fiscal_code": "SPNDNL80R13C555X"\n' + '}',
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
                text: 'Codice Fiscale',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'SPNDNL80R13C555X',
              },
            ],
          },
          apiResponse: {
            code: '{\n' + '  "sender_allowed": true\n' + '}',
            language: 'json',
            parts: [
              {
                component: 'innerHTML',
                html: 'Ecco la simulazione della risposta del server, che contiene l’esito sull’esistenza dell’utente desiderato.',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Invia un messaggio',
      anchor: '04',
      parts: [
        {
          component: 'typography',
          text: 'Una volta verificata l’esistenza dell’utente, puoi inviare un messaggio utilizzando questo endpoint',
        },
        {
          component: 'codeBlock',
          code: "POST 'https://api.io.pagopa.it/api/v1/profiles'",
          language: 'txt',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `{ \n` +
              `  "time_to_live": 3600, \n` +
              `  "content": { \n` +
              `    "subject": "Welcome new user!", \n` +
              `    "markdown": "# Titolo \\n testo del messaggio", \n` +
              `  }, \n` +
              `  "default_addresses": { \n` +
              `    "email": "example@example.com" \n` +
              `  }, \n` +
              `  "fiscal_code": "SPNDNL80R13C555X", \n` +
              `  "feature_level_type": "STANDARD" \n` +
              `} \n`,
            language: 'json',
            parts: [
              {
                component: 'typography',
                text: 'Invia la richiesta per vedere la simulazione della risposta del server',
                variant: 'body2',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Tempo di vita del messaggio:',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: '3600',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Titolo del messaggio:',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'Welcome new user!',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Testo del messaggio (markdown, 80-100 caratteri):',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: '# Titolo \\n testo del messaggio',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Mail utente:',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'example@example.com',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Codice Fiscale',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'SPNDNL80R13C555X',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Tipo di iscrizione usata:',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'STANDARD',
              },
            ],
          },
          apiResponse: {
            code: '{\n' + '  "id": "01EM6X4JB9VSZTQ8H16KMQFCEJ"\n' + '}',
            language: 'json',
            parts: [
              {
                component: 'innerHTML',
                html: 'Ecco la simulazione della risposta del server, che contiene l’identificato del messaggio.',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Verifica lo stato del messaggio',
      anchor: '05',
      parts: [
        {
          component: 'typography',
          text: 'Per verificare il corretto invio del messaggio, puoi inviare una richiesta di stato utilizzando questa chiamata',
        },
        {
          component: 'codeBlock',
          code: "GET 'https://api.io.pagopa.it/api/v1/messages/fiscal_code/id'",
          language: 'txt',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `curl --location --request \n` +
              `GET 'https://api.io.pagopa.it/api/v1/messages/SPNDNL80R13C555X/01EM6X4JB9VSZTQ8H16KMQFCEJ' \\ \n` +
              `--header 'Ocp-Apim-Subscription-Key: __YOUR_API_KEY__'\n`,
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
                text: 'APIM Key (ottenuto da step 2):',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: '__YOUR_API_KEY__',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Codice Fiscale',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'SPNDNL80R13C555X',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'identificativo (ottenuto da step 4):',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                style: {
                  overflowWrap: 'anywhere',
                },
                text: 'SPNDNL80R13C555X/01EM6X4JB9VSZTQ8H16KMQFCEJ',
              },
            ],
          },
          apiResponse: {
            code:
              `{ \n` +
              `  "message": { \n` +
              `    "content": { \n` +
              `        "subject": "My first IO app message with min 10 character", \n` +
              `        "markdown": "This is my first message to the IO app. Use body markdown format with min 80 character" \n` +
              `      }, \n` +
              `    "created_at": "2021-02-18T08:17:01.775Z", \n` +
              `    "fiscal_code": "SPNDNL80R13C555X", \n` +
              `    "id": "01EM6X4JB9VSZTQ8H16KMQFCEJ", \n` +
              `    "sender_service_id": "01EYNQ0864HKYR1Q9PXPJ18W7G" \n` +
              `  }, \n` +
              `  "notification": { \n` +
              `    "email": "SENT", \n` +
              `    "webhook": "SENT" \n` +
              `  }, \n` +
              `  "status": "PROCESSED" \n` +
              `} \n`,
            language: 'json',
            parts: [
              {
                component: 'innerHTML',
                html: 'Ecco la simulazione della risposta del server, che contiene tutte le informazioni relative allo stato di notifica del messaggio.',
              },
            ],
          },
        },
      ],
    },
  ],
  bannerLinks: appIoBannerLinks,
};
