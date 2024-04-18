import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { pdnd } from '@/_contents/pdnd/pdnd';
import { pdndQuickStartGuidePath } from '@/_contents/pdnd/quickStartGuidePath';
import { pdndBannerLinks } from '@/_contents/pdnd/bannerLinks';

export const pdndQuickStartGuide: QuickStartGuideData = {
  ...pdndQuickStartGuidePath,
  product: pdnd,
  abstract: {
    title: 'Quick start',
    description:
      'Se vuoi sapere come iscriverti a un e-service partendo dal catalogo e ottenere un voucher per la fruizione del sevizio.',
  },
  defaultStepAnchor: '01',
  steps: [
    {
      title: 'Naviga nel catalogo degli e-service',
      anchor: '01',
      parts: [
        {
          component: 'typography',
          text: 'Il primo passaggio per fruire di un e-service è navigare nel catalogo. Nel video interattivo seguente è possibile vedere come selezionare, visualizzare i dettagli tecnici e accedere ai contatti dell’erogatore per un specifico e-service.',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/KhPlp1c3yh4d5qbG8KPn?embed" \n` +
            `    frameborder="0" \n` +
            `    loading="lazy" \n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="PDND - Catalogo"  \n` +
            `  /> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Richiedi la fruizione di un specifico e-service',
      anchor: '02',
      parts: [
        {
          component: 'typography',
          text: 'Segui il video interattivo seguente per provare la richiesta di fruizione di un specifico e-service.',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/JfFRqvJbyoE6U36WMr2O?embed" \n` +
            `    frameborder="0" \n` +
            `    loading="lazy" \n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="PDND - Fruizione"  \n` +
            `  /> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Crea una finalità e associala ad un e-service',
      anchor: '03',
      parts: [
        {
          component: 'typography',
          text: "Per poter utilizzare un e-service è necessario creare almeno una finalità ad esso associata. La definizione della finalità è fondamentale per dettagliare le sue ragioni e modalità di accesso alle informazioni in possesso dell'erogatore. Nel video interattivo seguente è mostrato come creare una finalità e associarlaad un e-service.",
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/Gfuiabyhpc8NxZBm6IYu?embed" \n` +
            `    frameborder="0" \n` +
            `    loading="lazy" \n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="PDND | Finalità"  \n` +
            `  /> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Crea un client e associalo alla finalità',
      anchor: '04',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/RTU7WG7nJHOwU5CeOmGl?embed" \n` +
            `    frameborder="0" \n` +
            `    loading="lazy" \n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="PDND | Creazione client"  \n` +
            `  /> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Ottieni un voucher da utilizzare per fruire di un e-service',
      anchor: '05',
      parts: [
        {
          component: 'typography',
          text: 'Per prima cosa dovrai generare le chiavi di sicurezza per il tuo client. Apri il terminale e incolla i comandi qui sotto; come puoi vedere, abbiamo scelto un nome file corrispondente al nome del client creato nello step precedente.',
        },
        {
          component: 'codeBlock',
          language: 'bash',
          code:
            `openssl genrsa -out client-per-Dev-Portal.rsa.pem 2048 \n` +
            `openssl rsa -in client-per-Dev-Portal.rsa.pem -pubout -out client-per-Dev-Portal.rsa.pub \n` +
            `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in client-per-Dev-Portal.rsa.pem -out client-test-keypair.rsa.priv`,
        },
        {
          component: 'alert',
          severity: 'info',
          text: "Dopo aver generato la coppia di chiavi e averle riposte al sicuro, copia l'intero contenuto del file della chiave pubblica (quella che finisce in .pub); assicurati di includere anche le parti iniziale e finale (inizia con `-----BEGIN PUBLIC KEY-----` e finisce con `-----END PUBLIC KEY-----`);",
        },
        {
          component: 'typography',
          text: 'Aggiungi al client la chiave generata, seguendo gli step presentati nel video interattivo',
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe \n` +
            `    src="https://demo.arcade.software/wKXiIIoM9KzHZG2fuejj?embed" \n` +
            `    frameborder="0" \n` +
            `    loading="lazy" \n` +
            `    webkitallowfullscreen \n` +
            `    mozallowfullscreen \n` +
            `    allowfullscreen \n` +
            `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" \n` +
            `    title="PDND | Aggiunta chiave al client"  \n` +
            `  /> \n` +
            `</div> \n`,
        },
        {
          component: 'innerHTMLLazyLoaded',
          html: 'A questo punto sei pronto per creare e utilizzare un voucher per fruire di un e-service, <a href="./guides/manuale-operativo">seguendo le indicazioni contenute nel manuale</a>',
        },
      ],
    },
  ],
  bannerLinks: pdndBannerLinks,
};
