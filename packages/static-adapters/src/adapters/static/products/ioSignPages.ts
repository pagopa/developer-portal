import { ProductOverviewPreview } from 'core/domain/homepage';
import {
  QuickStartPreviewBlock,
  RelatedResourcesBlock,
  TutorialPreviewBlock,
} from 'core/domain/pageBlock';
import { Product, ProductPage } from 'core/domain/productPage';
import { ProductTutorialPage } from 'core/domain/productTutorialPage';

const ioSignProduct: Product = {
  name: 'Firma con IO',
  slug: 'firma-con-io',
};

const ioSignImage = {
  src: 'https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  alt: 'Immagine di Firma con IO',
};

export const ioSignPageLinks = {
  overview: `/${ioSignProduct.slug}/panoramica`,
  tutorial: `/${ioSignProduct.slug}/tutorial`,
  tutorialHowCreatePdf: `/${ioSignProduct.slug}/tutorial/come-preparare-il-documento-da-firmare`,
  quickStart: `/${ioSignProduct.slug}/guida-rapida`,
};

const ioSignRelated: RelatedResourcesBlock = {
  type: 'related-resources',
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
      description:
        'Tutorial semplici ed efficaci per approfondire ed apprendere task specifici',
      link: ioSignPageLinks.tutorialHowCreatePdf,
    },
    {
      type: 'guide',
      title: 'Consulta la guida tecnica',
      description: 'La guida tecnica completa per integrare Firma con IO',
      link: '#',
    },
  ],
};

// Tutorial ///////////////////////////////////////////////////////////////////

export const ioSignTutorialPage: Omit<ProductTutorialPage, 'breadcrumbs'> = {
  product: ioSignProduct,
  slug: 'come-preparare-il-documento-da-firmare',
  title:
    'Come creare e preparare il documento da firmare digitalmente con Firma con IO',
  description:
    'In questo tutorial vedremo come creare un documento in formato PDF o PDF/A-2A, e come identificare i campi firma per definire dove verrà apposta la firma digitale.',
  body: `
# Come creare e preparare il documento  da firmare digitalmente con Firma con IO

Firma con IO è una funzionalità che consente ai cittadini di **firmare documenti e contratti** tramite l’app IO in maniera semplice, veloce e sicura, e agli enti di **gestire tutti i processi di firma.** È una Firma Elettronica Qualificata (FEQ), ed  ha quindi il massimo valore legale probatorio, pari alla firma autografa, senza alcuna esclusione normativa.

Per l’avvio del processo di firma digitale con Firma con IO è necessario creare il documento da firmare, e identificare i punti in cui il cittadino dovrà firmarlo. **In questo tutorial vedremo come creare un documento in formato PDF o PDF/A-2A, e come identificare i campi firma per definire dove verrà apposta la firma digitale.**

## Creare un file in formato PDF/A-2A
Per creare un file in formato PDF/A2-A dovrai scrivere un documento utilizzando un qualsiasi word processor, avendo cura di verificare che preveda l’esportazione in questo formato (come ad esempio Microsoft Word, OpenOffice e LibreOffice). Non potrai creare un PDF da testi scansionati, perché verrebbero rappresentati come immagini e non come testi.

Dovrai quindi:

- Scrivere il testo
- Scegliere il formato PDF nel menu di esportazione
- Andare nelle Opzioni specifiche e scegliere il formato PDF/A2-A

Per verificare la conformità del documento puoi aprirlo con Acrobat Reader, avendo cura di aver precedentemente selezionato **modifica > preferenze > visualizza i documenti in modalità PDF/A.**

## Preparare i campi firma
A questo punto dovrai identificare i campi firma del documento, individuandone le “coordinate” (ovvero la posizione orizzontale X, la posizione verticale  Y, e le dimensioni) che poi dovrai inserire nella richiesta di creazione del dossier.   Per farlo, ti consigliamo di utilizzare il software GIMP, gratuito e disponibile per tutti i sistemi operativi. Ecco come procedere.

- scarica GIMP dal sito ufficiale e procedi all’installazione;
- apri GIMP;
- seleziona File > Apri e apri il modulo PDF o template da inviare in firma;
- se il PDF ha più di una pagina, scegli quella in cui vuoi che si visualizzi la firma grafica;
- disegna con il mouse il rettangolo nel quale l'utente apporrà la firma partendo dal punto in alto a sinistra del rettangolo;

Le informazioni da indicare verranno riportate all’interno dei campi **Posizione** e **Dimensione.** Assicurati che l’unità di misura sia impostata in Punti (pt) sia per la posizione che la dimensione.

![Immagine che indica come trovare la posizione della firma usando GIMP](/tutorial-sign-gimp.png)

## Usare le coordinate nella la creazione del dossier di richiesta di firma

A questo punto, le coordinate identificate andranno inserite nella richiesta di creazione del dossier, in particolare nella proprietà \`attrs\`

\`\`\`
"attrs":{
  "coordinates":{
    "x":360,
    "y":100
  },
  "size":{
    "w":170,
    "h":30
  },
  "page":0
}
\`\`\`

Puoi fare un test di creazione del dossier - inserendo anche le coordinate appena ricavate - nella guida rapida a tua disposizione [qui](${ioSignPageLinks.quickStart}).
  `,
};

export const ioSignTutorialPreview: TutorialPreviewBlock = {
  type: 'tutorial-preview',
  title: '',
  // TODO: Change the type, remove the title
  preview: {
    date: '13 luglio 2022',
    title: ioSignTutorialPage.title,
    description: ioSignTutorialPage.description,
    image: ioSignImage,
    link: ioSignPageLinks.tutorialHowCreatePdf,
  },
};

export const ioSignTutorialIndexPage: Omit<ProductPage, 'breadcrumbs'> = {
  product: ioSignProduct,
  slug: 'tutorial',
  title: 'Tutorial',
  blocks: [
    {
      type: 'hero-info',
      title: 'Tutorial',
      description:
        'Firma con IO è una funzionalità che consente ai cittadini di firmare documenti e contratti tramite l’app IO in maniera semplice, veloce e sicura; agli enti di gestire tutti i processi di firma in un unico posto. In questa guida rapida apprenderai i passaggi di base per integrare rapidamente Firma con IO nel tuo servizio.',
    },
    ioSignTutorialPreview,
    ioSignRelated,
  ],
};

// Quickstart /////////////////////////////////////////////////////////////////

export const ioSignQuickStartPreview: QuickStartPreviewBlock = {
  type: 'quickstart-preview',
  title: 'Scopri quanto è semplice integrarsi',
  description:
    'Firma con IO è una funzionalità che consente agli enti di richiedere la firma di documenti e di gestire i processi relativi in un unico posto.',
  steps: [
    {
      title: 'Prepara i documenti',
      description:
        "Prepara i documenti da inviare in firma all'utente nei formati previsti.",
    },
    {
      title: 'Crea una richiesta di firma',
      description: 'Crea un dossier contenente uno o più documenti.',
    },
    {
      title: 'Recupera il Codice Fiscale dell’utente',
      description:
        "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
    },
    {
      title: 'Invia la richiesta di firma',
      description:
        "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
    },
  ],
  link: ioSignPageLinks.quickStart,
};

export const ioSignQuickStartPage: Omit<ProductPage, 'breadcrumbs'> = {
  product: ioSignProduct,
  title: 'Guida rapida',
  slug: 'guida-rapida',
  blocks: [
    {
      type: 'hero-info',
      title: 'Guida Rapida',
      description:
        'Firma con IO è una funzionalità che consente ai cittadini di firmare documenti e contratti tramite l’app IO in maniera semplice, veloce e sicura; agli enti di gestire tutti i processi di firma in un unico posto. In questa guida rapida apprenderai i passaggi di base per integrare rapidamente Firma con IO nel tuo servizio.',
    },
    {
      type: 'quickstart',
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
    },
    ioSignRelated,
  ],
};

// Overview ///////////////////////////////////////////////////////////////////

export const ioSignOverviewPreview: ProductOverviewPreview = {
  title: 'Esplora le risorse per l’integrazione',
  preview: {
    title: 'Firma con IO',
    description:
      'Grazie a Firma con IO, i cittadini possono firmare documenti e contratti in maniera semplice, veloce e sicura direttamente tramite l’app IO. Integrandosi unicamente con questa funzionalità, gli Enti possono gestire tutti i processi di firma in un unico posto.',
    link: ioSignPageLinks.overview,
    image: ioSignImage,
  },
};

export const ioSignOverviewPage: Omit<ProductPage, 'breadcrumbs'> = {
  product: ioSignProduct,
  slug: 'panoramica',
  title: 'Panoramica',
  blocks: [
    {
      type: 'hero',
      title: 'Fai firmare documenti e contratti ai cittadini',
      description: 'Tutti i passaggi per integrare rapidamente Firma con IO.',
      cover:
        'https://github.com/pagopa/mui-italia/blob/main/src/components/Hero/assets/hero_background.png?raw=true',
    },
    ioSignQuickStartPreview,
    {
      ...ioSignTutorialPreview,
      title: 'Esplora i tutorial',
    },
  ],
};
