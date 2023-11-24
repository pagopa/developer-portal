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
  defaultStepAnchor: '00',
  steps: [
    {
      title: 'Per iniziare',
      anchor: '00',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html: 'Come prima cosa, dovrai avere a disposizione un documento in formato pdf contente l’atto da notificare, insieme ad eventuali allegati. </br> <b>Tutti i documenti PDF forniti alla piattaforma devono essere firmati digitalmente.</b>',
        },
        {
          component: 'alert',
          severity: 'info',
          title:
            'Se all’atto è collegato un pagamento tramite uno o più pagamenti pagoPA assicurati di avere generato il bollettino in formato pdf.',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html: 'In questo esempio utilizzeremo due documenti che chiameremo <b>notifica.pdf</b> e <b>pagamento.pdf</b>',
        },
      ],
    },
    {
      title: "Genera l'API Key",
      anchor: '01',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html: "Accedi all'<a href='https://selfcare.notifichedigitali.it'>Area Riservata - SEND</a>. In questo video interattivo troverai tutti i passaggi per generare la tua API Key. </br> <b>Ricorda di conservare la tua API Key, ti servirà come secret di autenticazione in tutte le chiamate alle API Rest di SEND.</b>",
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/DWHgngdrgv8TSKuLsVSQ?embed"\n` +
            `    frameborder="0" \n` +
            `    loading="lazy"\n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="Area Riservata -- SEND" \n` +
            `  /> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Calcolo del hash dei documenti',
      anchor: '02',
      parts: [
        {
          component: 'typography',
          text: 'Per essere certi che i documenti caricati siano quelli effettivamente allegati alla notifica è necessario calcolare il loro hash, con algoritmo SHA256 convertendolo in base64, ad esempio con i comandi:',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: `cat Notifica.pdf | openssl dgst -binary -sha256 | openssl base64 \ncat Pagamento.pdf | openssl dgst -binary -sha256 | openssl base64`,
          language: 'txt',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html: 'Otterai due stringhe hash code che <b>dovrai conservare per le chiamate API successive.</b>',
        },
      ],
    },
    {
      title: 'Richiedi le autorizzazioni per il caricamento dei documenti',
      anchor: '03',
      parts: [
        {
          component: 'typography',
          text: 'Richiedi a SEND le informazioni e le autorizzazioni necessarie per caricare uno o più file da allegare (compresi i bollettini pagoPA) a una notifica, inserisci nell’array del payload un elemento per ogni documento che vuoi caricare ed effettua la chiamata a questo endpoint:',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: 'POST /delivery/attachments/preload',
          language: 'txt',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `[{\n` +
              `  "preloadIdx": "Notifica_001",\n` +
              `  "contentType": "application/pdf",\n` +
              `  "sha256": "MuYRoTokYa80bZiASArg7zohUgU61QzS4EJ+ihYgwss="\n` +
              `},\n` +
              `{\n` +
              `  "preloadIdx": "Pagamento_001",\n` +
              `  "contentType": "application/pdf",\n` +
              `  "sha256": "wSg/ClStSKF9m2A3ULlS7mqNndVln1+1xr3XZfZ1gVI="\n` +
              `}]\n`,
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
                text: 'Stringhe sha256 ( ottenute dallo step 2)',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                asHtml: true,
                text: 'MuYRoTokYa80bZiASArg7zohUgU61QzS4EJ+ihYgwss=\n<br /><br />\nwSg/ClStSKF9m2A3ULlS7mqNndVln1+1xr3XZfZ1gVI=',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Indice di caricamento delle richieste',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'Notifica_001\nPagamento_001',
              },
            ],
          },
          apiResponse: {
            code:
              `[{ \n` +
              `  "preloadIdx": "Notifica_001", \n` +
              `  "secret": "AZ23RF12", \n` +
              `  "httpMethod": "PUT", \n` +
              `  "url": "https://preloadpn.aws.amazon.......", \n` +
              `  "key": "PN_NOTIFICATION_ATTACHMENTS-0001-301W-B9CB-9U72-WIKD"\n` +
              `},\n` +
              `{ \n` +
              `  "preloadIdx": "Pagamento_001", \n` +
              `  "secret": "BK45PS23", \n` +
              `  "httpMethod": "PUT", \n` +
              `  "url": "https://preloadpn.aws.amazon.......", \n` +
              `  "key": "PN_NOTIFICATION_ATTACHMENTS-0002-302W-B9DC-9U88-WIKD" \n` +
              `}]\n`,
            language: 'json',
            parts: [
              {
                component: 'innerHTMLLazyLoaded',
                html: 'Ecco la simulazione della risposta del server, che contiene l’URL di caricamento, e le stringhe <code style="background-color: #F4F5F7; font-size: 0.875em;">key</code> e <code style="background-color: #F4F5F7; font-size: 0.875em;">secret</code> associate al documento.',
              },
            ],
          },
        },
        {
          component: 'alert',
          severity: 'info',
          title:
            'Possono essere richieste un massimo di 15 autorizzazioni di caricamento per ogni richiesta. Le url restituite in risposta hanno una validità di 1h.',
        },
      ],
    },
    {
      title: 'Caricamento dei documenti',
      anchor: '04',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `Per poter inviare i documenti è necessario caricarli sullo storage, utilizzando i parametri ricevuti in risposta allo step 03 e generati nello step 02: \n` +
            `<br /> \n` +
            `<ul> \n` +
            `  <li>l’url da inserire è “url“ ricevuto nella riposta dello step 03</li> \n` +
            `  <li>il metodo da utilizzare è “httpMethod“ ricevuto nella riposta dello step 03</li> \n` +
            `  <li>Content-type è lo stesso inserito nella chiamata dello step 03</li> \n` +
            `  <li><code style="background-color: #F4F5F7; font-size: 0.875em;">x-amz-meta-secret</code> dovrà essere valorizzato con il “secret“ ricevuto nella riposta dello step 03</li> \n` +
            `  <li><code style="background-color: #F4F5F7; font-size: 0.875em;">x-amz-checksum-sha256</code> sono quelli ricavati dallo step 02</li> \n` +
            `</ul> \n` +
            `L’esempio che segue mostra come potrebbe essere realizzata la chiamata con il comando curl. Per ciascun documento occorre reiterare la chiamata.\n`,
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `//Caricamento Notifica.pdf \n` +
              `curl -X PUT \\ \n` +
              `-H "Content-type: application/pdf" \\ \n` +
              `-H "x-amz-meta-secret: AZ23RF12" \\ \n` +
              `-H "x-amz-checksum-sha256: MuYRoTokYa80bZiASArg7zohUgU61QzS4EJ+ihYgwss=" \\ \n` +
              `--verbose --data-binary '@Notifica.pdf' \\ \n` +
              `https://preloadpn.aws.amazon....... --verbose \n` +
              ` \n` +
              `//Caricamento Pagamento.pdf \n` +
              `curl -X PUT \\ \n` +
              `-H "Content-type: application/pdf" \\ \n` +
              `-H "x-amz-meta-secret: BK45PS23" \\ \n` +
              `-H "x-amz-checksum-sha256: wSg/ClStSKF9m2A3ULlS7mqNndVln1+1xr3XZfZ1gVI=" \\ \n` +
              `--verbose --data-binary '@Pagamento.pdf' \\ \n` +
              `https://preloadpn.aws.amazon....... --verbose \n`,
            language: 'txt',
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
                text: 'Stringhe secret (ottenute da step 3)',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'AZ23RF12 \nBK45PS23',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Stringhe sha256 ( ottenute dallo step 2)',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                asHtml: true,
                text: 'MuYRoTokYa80bZiASArg7zohUgU61QzS4EJ+ihYgwss=\n<br /><br />\nwSg/ClStSKF9m2A3ULlS7mqNndVln1+1xr3XZfZ1gVI=',
              },
            ],
          },
          apiResponse: {
            code:
              `Host: s3.eu-south-1.amazonaws.com \n` +
              ` User-Agent: curl/7.77.0 \n` +
              ` Accept: */* \n` +
              ` content-type: application/pdf \n` +
              ` x-amz-meta-secret: AZ23RF12 \n` +
              ` trailer: x-amz-checksum-sha256 \n` +
              ` x-amz-checksum-sha256: Fq9Vn4gAxHvvcaS0P6DGZOJ0/HjoViGOYwV7Hk7BRlM= \n` +
              ` Content-Length: 183909 \n` +
              ` [5 bytes data] \n` +
              `* We are completely uploaded and fine \n` +
              `{ [5 bytes data] \n` +
              `* Mark bundle as not supporting multiuse \n` +
              ` HTTP/1.1 200 OK \n` +
              ` x-amz-id-2: XXXXXXXXXXXXXXXX \n` +
              ` x-amz-request-id: 1234567890GY7G8Q \n` +
              ` Date: Wed, 19 Jul 2023 11:09:47 GMT \n` +
              ` x-amz-version-id: y8T2_G46HFMJv3gnthXYpNeIV8qgR85E \n` +
              ` x-amz-server-side-encryption: aws:kms \n` +
              ` x-amz-server-side-encryption-aws-kms-key-id: arn:aws:kms:eu-south-1:254707076084:key/3716a21f-6935-4f3b-aed9-48326c4abb2d \n` +
              ` x-amz-server-side-encryption-bucket-key-enabled: true \n` +
              ` ETag: "8cc717070109a83f7c627ef75efaa76c" \n` +
              ` x-amz-checksum-sha256: MuYRoTokYa80bZiASArg7zohUgU61QzS4EJ+ihYgwss= \n` +
              ` Server: AmazonS3 \n` +
              ` Content-Length: 0 \n` +
              `100  179k    0     0  100  179k      0   431k --:--:-- --:--:-- --:--:--  433k \n` +
              `* Connection #0 to host s3.eu-south-1.amazonaws.com left intact \n`,
            language: 'txt',
            parts: [
              {
                component: 'innerHTMLLazyLoaded',
                html: 'Ecco la simulazione della risposta del server di caricamento per il file Notifica.pdf, che contiene  il campo  <b>x-amz-version-id</b> da utilizzare nello step successivo',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Richiesta di creazione della notifica',
      anchor: '05',
      parts: [
        {
          component: 'typography',
          text: 'A questo punto sarà possibile richiedere l’invio della notifica, l’operazione va ripetuta per tutti i documenti che si vogliono inoltrare,  effettuando la chiamata a questo endpoint',
          variant: 'body2',
        },
        {
          component: 'codeBlock',
          code: 'POST /delivery/requests',
          language: 'txt',
        },
        {
          component: 'apiTester',
          apiRequest: {
            code:
              `{ \n` +
              `  "idempotenceToken":"1ab23c45-6789-1234-d5ef-6a789b12cde3", \n` +
              `  "paProtocolNumber": "Prot_001", \n` +
              `  "subject": "Prova Notifica 001", \n` +
              `  "recipients": [ \n` +
              `    { \n` +
              `      "recipientType": "PF|PG", \n` +
              `      "taxId": "HVUEQP09U6QMNN5Z", \n` +
              `      "denomination": "Rossi Mario", \n` +
              `      "physicalAddress": { \n` +
              `        "address": "Via Larga 10", \n` +
              `        "zip": "00100", \n` +
              `        "municipality": "Roma" \n` +
              `      }, \n` +
              `      "payment": { \n` +
              `        "noticeCode": "302000100000019421", \n` +
              `        "creditorTaxId": "77777777777", \n` +
              `        "noticeCodeAlternative": "302000100000019421", \n` +
              `        "pagoPaForm": { \n` +
              `          "digests": { \n` +
              `            "sha256": "wSg/ClStSKF9m2A3ULlS7mqNndVln1+1xr3XZfZ1gVI=" \n` +
              `          }, \n` +
              `          "contentType": "application/pdf", \n` +
              `          "ref": { \n` +
              `            "key": "BK45PS23", \n` +
              `            "versionToken": "y8T2_G46HFMJv3gnthXYpNeIV8qgR85E" \n` +
              `          } \n` +
              `        } \n` +
              `      } \n` +
              `    } \n` +
              `  ], \n` +
              `  "documents": [ \n` +
              `    { \n` +
              `      "digests": { \n` +
              `        "sha256": "wSg/ClStSKF9m2A3ULlS7mqNndVln1+1xr3XZfZ1gVI=" \n` +
              `      }, \n` +
              `      "contentType": "application/pdf", \n` +
              `      "ref": { \n` +
              `        "key": "safestorage://BK45PS23", \n` +
              `        "versionToken": "x-amz-version-id" \n` +
              `      }, \n` +
              `    } \n` +
              `  ], \n` +
              `  "notificationFeePolicy": "FLAT_RATE|DELIVERY_MODE", \n` +
              `  "physicalCommunicationType": "AR_REGISTERED_LETTER|REGISTERED_LETTER_890", \n` +
              `  "senderDenomination": "MittenteCF", \n` +
              `  "senderTaxId": "PA_CF", \n` +
              `  "amount": 0, \n` +
              `  "paymentExpirationDate": "2023-11-28", \n` +
              `  "taxonomyCode": "010101P" \n` +
              `} \n`,
            language: 'json',
            parts: [
              {
                component: 'typography',
                text: 'Di seguito si riportano, a titolo esemplificativo, una parte dei campi presenti nel payload. Invia la richiesta di esempio per vedere la risposta del server.',
                variant: 'body2',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Numero di protocollo',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'Prot_001',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Titolo della notifica',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'Prova Notifica 001',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Token di disambiguazione',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: '1ab23c45-6789-1234-d5ef-6a789b12cde3',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Dati del destinatario',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                asHtml: true,
                text:
                  `Tipo: PF (persona fisica) \n<br />` +
                  `Codice Fiscale: HVUEQP09U6QMNN5Z \n<br />` +
                  `Denominazione: Rossi Mario \n<br />` +
                  `Via: Via Larga 10 \n<br />` +
                  `CAP: 00100 \n<br />` +
                  `Città: Roma \n<br />`,
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Token di versione: (ottenute da step 4)',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'y8T2_G46HFMJv3gnthXYpNeIV8qgR85E',
              },
              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Politica di addebitamento dei costi di notifica:',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'FLAT_RATE',
              },

              {
                component: 'typography',
                color: '#5C6F82',
                fontSize: '12px',
                sx: { marginBottom: '0' },
                text: 'Tipologia comunicazione fisica',
                variant: 'subtitle1',
              },
              {
                component: 'typography',
                fontSize: '16px',
                fontWeight: '600',
                text: 'AR_REGISTERED_LETTER',
              },
            ],
          },
          apiResponse: {
            code:
              `{ \n` +
              `  "idempotenceToken":"1ab23c45-6789-1234-d5ef-6a789b12cde3", \n` +
              `  "notificationRequestId": "Jx3gk+Qfi54Dznl3SP+1kTR5wnxVlAi4QaTp", \n` +
              `  "paProtocolNumber": "Prot_001" \n` +
              `} \n`,
            language: 'json',
            parts: [
              {
                component: 'innerHTMLLazyLoaded',
                html: 'Ecco la simulazione della risposta del server , che contiene l’ID della notifica e il numero di protocollo che hai scelto.',
              },
            ],
          },
        },
      ],
    },
  ],
  bannerLinks: sendBannerLinks,
};
