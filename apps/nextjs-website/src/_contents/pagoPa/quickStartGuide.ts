import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaQuickStartGuidePath } from '@/_contents/pagoPa/quickStartGuidePath';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

export const pagoPaQuickStartGuide: QuickStartGuideData = {
  ...pagoPaQuickStartGuidePath,
  product: pagoPa,
  abstract: {
    title: 'Quick start',
    description:
      'Se vuoi sapere cosa devi fare per integrarti, sei nel posto giusto. Con la quick start scoprirai in poco tempo tutti i passaggi che compongono il processo di integrazione.',
  },
  defaultStepAnchor: '01',
  steps: [
    {
      title: 'Creazione di un certificato x509',
      anchor: '01',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<p>Per connettersi alla piattaforma PagoPA, devi dotarti di un certificato x509, emesso da una Certification Authority che compaia fra i membri del CA/Browser Forum (<a href="https://cabforum.org/members/" target="_blank">Members - CAB Forum</a>). È facoltà della PagoPA S.p.A. autorizzare la connessione utilizzando un certificato emesso da differente CA e autorizzare la connessione all’ambiente di test esterno utilizzando altro tipo di certificato;</p>` +
            `<p>Il campo Subject di ogni certificato deve contenere un CN coerente con l'FQDN della URL del servizio che intende esporre e deve essere fornito  l'URL del servizio applicativo che si intende esporre nel formato: \n <a href="https://FQDN/nomeservizio" target="_blank">https://FQDN/nomeservizio.</a> </p>`,
        },
        {
          component: 'alert',
          severity: 'info',
          title: "L'FQDN deve coincidere con il CN specificato",
        },
        {
          component: 'innerHTMLLazyLoaded',
          html: `<p>Per altre info sul certificato, <a href="/pagopa/guides/sanp/3.4.1/appendici/connettivita" target="_blank">visita questa pagina</a>.</p>`,
        },
      ],
    },
    {
      title: 'Generazione API key',
      anchor: '02',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html: `<p>Accedi alla <a href="https://selfcare.pagopa.it/auth/login" target="_blank">piattaforma Self Care</a> e seleziona Piattaforma PagoPA per generare le API Key. In questo video interattivo troverai tutti i passaggi utili per la sua creazione.</p>`,
        },
        {
          component: 'innerHTMLLazyLoaded',
          html:
            `<div style="position: relative; padding-bottom: calc(64.41666666666667% + 41px); height: 0; width: 100%"> \n` +
            `  <iframe src="https://demo.arcade.software/nMt9Gd1ulmuLwIDGQC1R?embed" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;" title="PagoPA Piattaforma Self Care – pagoPA"> \n` +
            `  </iframe> \n` +
            `</div> \n`,
        },
      ],
    },
    {
      title: 'Autenticazione nella connettività in ingresso (ex modello 3)',
      anchor: '03',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html: `Modifica la tua applicazione affinché inserisca nell’header delle richieste SOAP la chiave <code>Ocp-Apim-Subscription-Key</code> avente il valore della API key rilasciata nel passaggio precedente, di seguito a titolo di esempio una possibile chiamata.`,
        },
        {
          component: 'codeBlock',
          code:
            `curl --location --request  \n` +
            `POST 'https://<developer_path>/nodo-auth/node-for-psp/v1' \\ \n` +
            `--header 'SOAPAction: verifyPaymentNotice' \\ \n` +
            `--header 'Content-Type: application/xml' \\ \n` +
            `--header 'Ocp-Apim-Subscription-Key: ocpapimsubscriptionstring..' \\ \n` +
            `--header 'Cookie: here cookiestring12345678....'  \n` +
            `\\--data-raw '  \n` +
            `' <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:nod="http://<developer_path>/node/nodeForPsp.xsd"> \n` +
            `    <soapenv:Header/> \n` +
            `    <soapenv:Body> \n` +
            `      <nod:verifyPaymentNoticeReq> \n` +
            `        <idPSP>ID_PSP</idPSP> \n` +
            `        <idBrokerPSP>123456789</idBrokerPSP> \n` +
            `        <idChannel>123456789_01</idChannel> \n` +
            `        <qrCode> \n` +
            `          <fiscalCode>77777777777</fiscalCode> \n` +
            `          <noticeNumber>0000111111112222222</noticeNumber> \n` +
            `        </qrCode> \n` +
            `      </nod:verifyPaymentNoticeReq> \n` +
            `    </soapenv:Body> \n` +
            `  </soapenv:Envelope>' \n`,
          language: 'txt',
        },
      ],
    },
    {
      title: 'Connettività in uscita (ex modello 1)',
      anchor: '04',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html: `<p>Scarica il certificato pubblico messo a disposizione da PagoPA e abilita la mutua autenticazione. I certificati sono pubblicati e quindi scaricabili sul repository <a href="https://github.com/pagopa/pagopa-node-forwarder" target="_blank">https://github.com/pagopa/pagopa-node-forwarder</a>.</p>`,
        },
        {
          component: 'alert',
          severity: 'info',
          title: 'Per accedere al repository devi essere accreditato',
        },
      ],
    },
    {
      title: 'Processi di pagamento',
      anchor: '05',
      parts: [
        {
          component: 'innerHTMLLazyLoaded',
          html: `<p>Procedi con i processi di pagamento secondo la documentazione che <a href="/pagopa/guides/sanp/3.4.1/casi-duso/pagamento-di-un-avviso-presso-psp" target="_blank">trovi qui</a>.</p>`,
        },
      ],
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};
