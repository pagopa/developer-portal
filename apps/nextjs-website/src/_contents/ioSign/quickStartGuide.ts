import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { ioSignQuickStartGuidePath } from '@/_contents/ioSign/quickStartGuidePath';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignQuickStartGuide: QuickStartGuideData = {
  ...ioSignQuickStartGuidePath,
  product: ioSign,
  abstract: {
    title: 'Quick start',
    description:
      'In questa Quick Start apprenderai i passaggi di base per creare un dossier con la richiesta di firma, inviarla, ricevere i documenti firmati e integrare rapidamente Firma con IO nel tuo servizio.',
  },
  defaultStepAnchor: '01',
  steps: [
    {
      title: 'Prepara i documenti',
      anchor: '01',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `Prepara i documenti da inviare in firma all'utente in uno dei seguenti formati:` +
            `</br>` +
            `<ul>` +
            `	<li>PDF standard</li>` +
            `	<li>PDF A-2A</li>` +
            `	<li>PDF già firmati con firma PAdES</li>` +
            `</ul>` +
            `Individua le coordinate dove l’utente dovrà apporre la sua firma.`,
        },
      ],
    },
    {
      title: 'Crea un Dossier',
      anchor: '02',
      parts: [
        {
          component: 'typography',
          text: 'Crea un Dossier (ovvero un template per la creazione della richiesta di firma) e invia la chiamata a',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `POST /api/v1/sign/dossiers`,
          language: 'txt',
        },
        {
          component: 'typography',
          text: "Ogni Dossier rappresenta un caso d'uso specifico e può contenere più documenti. Qui sotto trovi un esempio dei dati necessari per la compilazione di un Dossier e della risposta del server che restituisce il Dossier ID che ti servirà più avanti.",
          variant: 'body2',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `{ \n` +
              `  "title": "Contratto 150 ore", \n` +
              `  "documents_metadata": [ \n` +
              `    { \n` +
              `      "title": "Contratto", \n` +
              `      "signature_fields": [ \n` +
              `        { \n` +
              `          "clause": { \n` +
              `            "title": "Firma contratto", \n` +
              `            "type": "REQUIRED" \n` +
              `          }, \n` +
              `          "attrs": { \n` +
              `            "coordinates": { \n` +
              `              "x": 120, \n` +
              `              "y": 2340 \n` +
              `            }, \n` +
              `            "size": { \n` +
              `              "w": 120, \n` +
              `              "h": 120 \n` +
              `            }, \n` +
              `            "page": 1 \n` +
              `          } \n` +
              `        } \n` +
              `      ] \n` +
              `    } \n` +
              `  ] \n` +
              `} \n`,
            language: 'json',
            description:
              'Invia la richiesta per vedere la simulazione della risposta del server',
            attributes: [
              { label: 'Nome del Dossier', value: 'Contratto 150 ore' },
              { label: 'Titolo del documento', value: 'Contratto' },
              { label: 'Titolo della firma', value: 'Firma contratto' },
              { label: 'Tipo di clausola associata', value: 'Obbligatoria' },
              { label: 'Coordinate della firma', value: 'X: 120 </br>Y: 2340' },
              { label: 'Dimensioni della firma', value: 'W: 120 </br>H: 120' },
            ],
          },
          apiResponse: {
            code:
              `{ \n` +
              `  "id": "01GG4NFBCN4ZH8ETCCKX3766KX", \n` +
              `  "title": "Contratto 150 ore", \n` +
              `  "documents_metadata": [ \n` +
              `    { \n` +
              `      "title": "Contratto", \n` +
              `      "signature_fields": [ \n` +
              `        { \n` +
              `          "unique_name": "Signature1", \n` +
              `          "clause": { \n` +
              `            "title": "Firma contratto", \n` +
              `            "type": "REQUIRED" \n` +
              `          } \n` +
              `        } \n` +
              `      ] \n` +
              `    } \n` +
              `  ], \n` +
              `  "created_at": "aaaa-mm-ddT00:00:00.000Z", \n` +
              `  "updated_at": "aaaa-mm-ddT00:00:00.000Z" \n` +
              `} \n`,
            language: 'json',
            description:
              'Ecco la risposta del server che conferma i dati inviati e fornisce l’ID di Firma',
          },
        },
      ],
    },
    {
      title: 'Recupera l’ID del Cittadino',
      anchor: '03',
      parts: [
        {
          component: 'typography',
          text: "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `POST /api/v1/sign/signers`,
          language: 'txt',
        },
        {
          component: 'typography',
          text: "specificando nella chiamata il Codice Fiscale dell'utente Il server ti restituirà l’ID del cittadino che ti servirà nel prossimo passaggio.",
          variant: 'body2',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code: '{\n' + '  "fiscal_code": "AAABBB00A00A000"\n' + '}',
            language: 'json',
            description:
              'Invia la richiesta per vedere la simulazione della risposta del server',
            attributes: [{ label: 'Codice Fiscale', value: 'AAABBB00A00A000' }],
          },
          apiResponse: {
            code: '{ "id":"01GG4TG9FP2D3JPWFTAM0WEFTG" }',
            language: 'json',
            description:
              'Ecco la risposta del server che fornisce l’ID del cittadino corrispondente al codice fiscale fornito',
          },
        },
      ],
    },
    {
      title: 'Crea la richiesta di firma',
      anchor: '04',
      parts: [
        {
          component: 'typography',
          text: "Ora hai tutto ciò che occorre per creare la richiesta di firma effettuando una chiamata all'endpoint",
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `POST /api/v1/sign/signature-requests`,
          language: 'txt',
        },
        {
          component: 'typography',
          text: 'Inserendo i dati precedentemente generati otterrai la Signature request.',
          variant: 'body2',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `{\n` +
              `  "dossier_id": "01GG4NFBCN4ZH8ETCCKX3766KX",\n` +
              `  "signer_id": "01GG4TG9FP2D3JPWFTAM0WEFTG",\n` +
              `  "expires_at": "2023-01-01T00:00:00.000Z"\n` +
              `}\n`,
            language: 'json',
            description:
              'Invia la richiesta con i dati ottenuti dagli step precedenti, per vedere la simulazione della risposta del server',
            attributes: [
              {
                label: 'Identificativo del dossier',
                value: '01GG4NFBCN4ZH8ETCCKX3766KX',
              },
              {
                label: 'Identificativo del cittadino',
                value: '01GG4TG9FP2D3JPWFTAM0WEFTG',
              },
            ],
          },
          apiResponse: {
            code:
              `{\n` +
              `  "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",\n` +
              `  "status": "DRAFT",\n` +
              `  "dossier_id": "01GG4NFBCN4ZH8ETCCKX3766KX",\n` +
              `  "signer_id": "01GG4TG9FP2D3JPWFTAM0WEFTG",\n` +
              `  "expires_at": "2023-01-01T00:00:00.000Z",\n` +
              `  "documents": [\n` +
              `    {\n` +
              `      "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",\n` +
              `      "metadata": {\n` +
              `        "title": "Firma contratto 150 ore",\n` +
              `        "signature_fields": [\n` +
              `          {\n` +
              `            "attrs": {\n` +
              `              "unique_name": "Signature1"\n` +
              `            },\n` +
              `            "clause": {\n` +
              `              "title": "Contratto",\n` +
              `              "type": "REQUIRED"\n` +
              `            }\n` +
              `          }\n` +
              `        ]\n` +
              `      },\n` +
              `      "created_at": "2018-10-13T00:00:00.000Z",\n` +
              `      "updated_at": "2018-10-13T00:00:00.000Z",\n` +
              `      "status": "WAIT_FOR_UPLOAD"\n` +
              `    }\n` +
              `  ],\n` +
              `  "created_at": "2018-10-13T00:00:00.000Z",\n` +
              `  "signed_at": "2018-10-13T00:00:00.000Z"\n` +
              `}\n`,
            language: 'json',
            description:
              'Ecco la risposta del server che contiene l’ID della Signature request',
          },
        },
      ],
    },
    {
      title: 'Carica i documenti',
      anchor: '05',
      parts: [
        {
          component: 'typography',
          text: "È arrivato il momento di caricare i tuoi documenti su un Document Storage dedicato, utilizzando Signature ID e Document ID che hai ottenuto nella Signature Request. Per farlo, dovrai ottenere l'URL di caricamento chiamando questo endpoint",
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `GET /api/v1/sign/signature-requests/{signature_request_id}/documents/{document_id}/upload_url`,
          language: 'txt',
        },
      ],
    },
    {
      title: 'Invia la richiesta di firma e ricevi i documenti firmati',
      anchor: '06',
      parts: [
        {
          component: 'typography',
          text: 'Per pubblicare la richiesta di firma, utilizza questo endpoint specificando READY nel corpo della richiesta',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `PUT /api/v1/sign/signature-requests/{signature_request_id}/status`,
          language: 'txt',
        },
        {
          component: 'typography',
          text: 'Attendi alcuni secondi che lo stato passi da READY a WAIT_FOR_SIGNATURE e poi verifica lo stato con questo endpoint',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `GET /api/v1/sign/signature-requests/{signature_request_id}`,
          language: 'txt',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `Invia i documenti nelle due modalità previste:` +
            `</br>` +
            `<ul>` +
            ` <li>Tramite <a href="./guides/manuale-operativo/richiedere-una-firma/invio-della-richiesta-di-firma/tramite-pulsante-firma-con-io-o-qr-code">QR Code</a> (anche con il supporto del <a href="./guides/manuale-operativo/richiedere-una-firma/invio-della-richiesta-di-firma/tramite-pulsante-firma-con-io-o-qr-code">pulsante Firma con IO</a>)</li>` +
            ` <li>Sull’app IO, effettuando una richiesta, senza specificare nulla nel messaggio, verso questo endpoint</li>` +
            `</ul>`,
        },
        {
          component: 'codeBlock',
          code: `PUT /api/v1/sign/signature-requests/{signature_request_id}/notification`,
          language: 'txt',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code: `PUT /api/v1/sign/signature-requests/{signature_request_id}/notification`,
            language: 'txt',
            description:
              'Invia la richiesta con il valore ricavato dallo step 4 per vedere la simulazione della risposta del server',
            attributes: [
              {
                label: 'Identificativo della richiesta:',
                value: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
              },
            ],
          },
          apiResponse: {
            code:
              '{\n' + '  "io_message_id": "01G7VBM888NDGCMA84ZVZYJGZQ"\n' + '}',
            language: 'json',
            description:
              'Ecco la risposta del server che contiene l’ID del messaggio ricevuto dall’utente',
          },
        },
        {
          component: 'typography',
          text: 'Verifica lo stato della firma e ottieni i documenti firmati effettuando una chiamata a questo endpoint:',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `GET /api/v1/sign/signature-requests/{signature_request_id}`,
          language: 'txt',
        },
      ],
    },
  ],
  bannerLinks: ioSignBannerLinks,
};
