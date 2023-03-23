import { ProductQuickStart } from '@/domain/product';

export const staticProductQuickStartPage: ProductQuickStart = {
  product: {
    name: 'Firma con IO',
    rootPath: '/firma-con-io',
  },
  title: 'Guida rapida',
  description:
    'Firma con IO è una funzionalità che consente ai cittadini di firmare documenti e contratti tramite l’app IO in maniera semplice, veloce e sicura; agli enti di gestire tutti i processi di firma in un unico posto. In questa guida rapida apprenderai i passaggi di base per integrare rapidamente Firma con IO nel tuo servizio.',
  steps: [
    {
      title: 'Prepara i documenti',
      description: [
        {
          type: 'paragraph',
          text: `Prepara i documenti da inviare in firma all'utente, in formato PDF standard, PDF A-2A o PDF già firmati con firma PAdES, e trova le coordinate dove vorrai apporre la firma.`,
        },
      ],
    },
    {
      title: 'Crea una richiesta di firma',
      description: [
        {
          type: 'paragraph',
          text: `Crea un Dossier (ovvero un template per la creazione della richiesta di firma) e invia la chiamata a`,
        },
        {
          type: 'inline-code',
          text: `POST /api/v1/sign/dossiers`,
        },
        {
          type: 'paragraph',
          text: `Ogni Dossier rappresenta un caso d'uso specifico e può contenere più documenti. Qui sotto trovi un esempio della compilazione di un Dossier e della risposta del server che restituisce il Dossier ID che ti servirà più avanti.`,
        },
      ],
      example: {
        title: 'Dati richiesti per ogni Dossier',
        fields: [
          {
            description: 'Nome del Dossier',
            value: 'Contratto 150 ore',
          },
          {
            description: 'Titolo del documento',
            value: 'Contratto',
          },
          {
            description: 'Titolo della firma',
            value: 'Firma del contratto',
          },
          {
            description: 'Tipo di clausola associata',
            value: 'Obbligatoria',
          },
          {
            description: 'Coordinate della firma',
            value: 'X: 120   Y: 2340',
          },
          {
            description: 'Dimensioni della firma',
            value: 'W: 120   Y: 2340',
          },
        ],
        request: {
          title: 'Dossier ID',
          body: `{"title": "Contratto 150 ore","documents_metadata":[{"title":"Contratto","signature_fields":[{"clause":{"title":"Firma del contratto","type":"REQUIRED"},"attrs":{"coordinates":{"x": 120,"y": 2340},"size":{"w": 120,"h": 2340},"page":1}}]}]}`,
        },
      },
    },
    {
      title: `Recupera il Codice Fiscale dell'utente`,
      description: [
        {
          type: 'paragraph',
          text: `Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.`,
        },
        {
          type: 'inline-code',
          text: `POST /api/v1/sign/signers`,
        },
        {
          type: 'paragraph',
          text: `specificando nella chiamata il Codice Fiscale dell'utente Il server ti restituirà l’ID del cittadino che ti servirà nel prossimo passaggio.`,
        },
      ],
      example: {
        title: 'Dati richiesti per l’ID del cittadino',
        fields: [
          {
            description: 'Codice Fiscale',
            value: 'AAABBB89C11D222E',
          },
        ],
        request: {
          title: 'Codice Fiscale cittadino',
          body: `{"fiscal_code":"AAABBB89C11D222E"}`,
        },
      },
    },
    {
      title: `Invia la richiesta di firma`,
      description: [
        {
          type: 'paragraph',
          text: `Ora hai tutto quel che occorre per inviare la richiesta di firma effettuando una chiamata all'endpoint.`,
        },
        {
          type: 'inline-code',
          text: `POST /api/v1/signature_request`,
        },
        {
          type: 'paragraph',
          text: `Inserendo i dati precedentemente generati otterrai la Signature request.`,
        },
      ],
      example: {
        title: 'Dati richiesti per l’ID del cittadino',
        fields: [
          {
            description: `L'ID del dossier che hai ricevuto`,
            value: '01GG4NFBCN4ZH8ETCCKX3766KX',
          },
          {
            description: `L'ID del Cittadino che hai ricevuto`,
            value: '01GG4TG9FP2D3JPWFTAM0WEFTG',
          },
          {
            description: `Data e ora di scadenza del dossier`,
            value: ' 2023-01-01T00:00:00.000',
          },
        ],
        request: {
          title: 'Informazioni richiesta di firma',
          body: `{"dossier_id": "01GG4NFBCN4ZH8ETCCKX3766KX","signer_id": "01GG4TG9FP2D3JPWFTAM0WEFTG","expires_at": "2023-01-01T00:00:00.000Z"}`,
        },
      },
    },
    {
      title: `Upload dei documenti`,
      description: [
        {
          type: 'paragraph',
          text: `È arrivato il momento di caricare i tuoi documenti su un Document Storage dedicato, utilizzando Signature ID e Document ID che hai ottenuto nella Signature Request. Per farlo, dovrai ottenere l'URL di caricamento chiamando questo endpoint.`,
        },
        {
          type: 'inline-code',
          text: `GET /api/v1/sign/signature-requests/{signature_request_id}/documents/{document_id}/upload_url;`,
        },
      ],
    },
    {
      title: `Invio della richiesta di firma e ricezione dei documenti firmati`,
      description: [
        {
          type: 'paragraph',
          text: `A questo punto non resta altro che inviare i documenti per la firma, e ottenere i documenti firmati.`,
        },
        {
          type: 'paragraph',
          text: `Attendi che lo stato del documento passi dallo stato READY allo stato WAIT_FOR_SIGNATURE effettuando una richiesta di verifica dello stato a questo endpoint`,
        },
        {
          type: 'inline-code',
          text: `PUT /api/v1/sign/signature-requests/{signature_request_id};`,
        },
        {
          type: 'paragraph',
          text: `Invia i documenti su App IO effettuando una richiesta, senza specificare nulla nel messaggio, verso questo endpoint`,
        },
        {
          type: 'inline-code',
          text: `PUT /api/v1/sign/signature-requests/{signature_request_id}/notification;`,
        },
        {
          type: 'paragraph',
          text: `Riceverai una risposta contenente l'ID del messaggio ricevuto dall'utente:`,
        },
        {
          type: 'code-block',
          title: 'ID del messaggio',
          text: `{"io_message_id":"01G7VBM888NDGCMA84ZVZYJGZQ"}`,
        },
        {
          type: 'paragraph',
          text: `Ricevi i documenti firmati effettuando una chiamata a questo endpoint:`,
        },
        {
          type: 'inline-code',
          text: `GET /api/v1/sign/signature-requests/{signature_request_id};`,
        },
      ],
    },
  ],
  related: {
    title: 'Risorse correlate',
    references: [
      {
        type: 'api',
        title: 'Vedi le API',
        description: 'Naviga e prova le API di Firma con IO',
        link: '#',
      },
      {
        type: 'tutorial',
        title: 'Scopri i tutorial',
        description: 'Tutorial semplici ed efficaci per approfondire ed apprendere task specifici',
        link: '#',
      },
      {
        type: 'guide',
        title: 'Consulta la guida tecnica',
        description: 'La guida tecnica completa per integrare Firma con IO',
        link: '#',
      },
    ],
  },
};
