import { parseMjmlToHtml } from './mjmlParser';

const TRANSLATIONS = {
  previewText: 'Finalmente sei dei nostri',
  title: 'Finalmente sei dei nostri',
  hello: 'Ciao',
  text:
    'Siamo felici di averti a bordo.<br><br>' +
    'Il DevPortal di PagoPA è il portale web unico, ufficiale e aggiornato per il reperimento di tutte le risorse utili all’integrazione con i nostri prodotti.<br><br><br>' +
    'Al suo interno troverai:<br>' +
    '<ul class="squared">' +
    '  <li>Strumenti interattivi che offrono una vista sintetica del processo di integrazione di ogni prodotto;</li>' +
    '  <li>Documentazione API, guide tecniche e manuali per approfondire tutte le informazioni di dettaglio;</li>' +
    '  <li>Tutorial che ti accompagneranno nello svolgimento di task specifici.</li>' +
    '</ul>',
  startExploring: 'Inizia ad esplorare',
  seeYouSoon: 'A presto,<br><br>il team DevPortal',
  companyLegalDetails:
    'PagoPA S.p.A. - Società per azioni con socio unico capitale sociale di euro 1,000,000 i.v.Sede legale in Roma, Piazza Colonna 370, CAP 00187Sede operativa in Roma, Via Sardegna 38, CAP 00187N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009',
  wrongRecipient:
    'Ricevi questa e-mail perché hai creato un account su PagoPA DevPortal.',
};
export const makePostConfirmationConfirmSignUpEmail = (
  firstName: string,
  domain: string
): string =>
  parseMjmlToHtml(postConfirmationConfirmSignUpMessage(firstName, domain));

const postConfirmationConfirmSignUpMessage = (
  firstName: string,
  domain: string
): string => `
<mjml>
  <mj-head>
    <mj-preview>${TRANSLATIONS.previewText}</mj-preview>
    <mj-font name="Titillium Web" href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;1,400&display=swap" />
    <mj-style>
      .section {
        box-sizing: border-box;
        padding: 20px;
      }
      @media (min-width:480px) { 
        .section {
          padding: 32px 40px 32px 40px;
        }
      }
      @media (min-width:960px) { 
        .section {
          padding: 78px 106px 60px 106px;
        }
      }
      .box-shadow {
        border: 1px solid #fefefe;
        box-shadow: 0px 0px 45px 0px #0000001A;
      }
      .link a:link, .link a:visited, .link a:focus, .link a:hover, .link a:active {
        text-decoration: none;
        color: #0073E6;
      }
      .squared {
        list-style-type: square;
        list-style-position: outside;
      }
    </mj-style>
    <mj-attributes>
      <mj-class name="title" font-family="'Titillium Web', sans-serif" font-size="32px" font-weight="700" color="#17324D" />
      <mj-class name="text" font-family="'Titillium Web', sans-serif" font-weight="400" color="#17324D" line-height="24px" align="left" />
      <mj-class name="footer-text" font-family="'Titillium Web', sans-serif" font-size="14px" font-weight="400" color="#5C6F82" line-height="24px" align="left" />
    </mj-attributes>
  </mj-head>
  <mj-body width="800px">
    <mj-spacer height="10px" />
    <mj-section css-class="section box-shadow" background-color="#fff">
      <mj-column width="100%" padding-bottom="24px">
        <mj-image  src="https://${domain}/images/logo-pago-pa.png" alt="PagoPA" width="114px" height="33px" />
      </mj-column>
      <mj-column width="100%">
        <mj-text mj-class="title" align="left" color="#17324D" font-size="32px">${
          TRANSLATIONS.title
        }</mj-text>
      </mj-column>
      <mj-column css-class="container" width="100%" padding-top="22px">
        <mj-text mj-class="text" font-size="18px">${
          TRANSLATIONS.hello
        } ${firstName},</mj-text>
        <mj-spacer height="36px" />
        <mj-text mj-class="text" font-size="18px">${TRANSLATIONS.text}</mj-text>
        <mj-button align="left" background-color="#0073E6" href="${`https://${domain}`}" font-size="16px" font-weight="700">
          ${TRANSLATIONS.startExploring}
        </mj-button>
        <mj-spacer height="48px" />
        <mj-text mj-class="text" font-size="18px">${
          TRANSLATIONS.seeYouSoon
        }</mj-text>
        <mj-spacer height="5px" />
        <mj-divider border-width="1px" border-style="solid" border-color="#E3E7EB" />
        <mj-spacer height="5px" />
        <mj-text mj-class="text" font-size="14px">${
          TRANSLATIONS.wrongRecipient
        }</mj-text>
        <mj-text mj-class="footer-text">${
          TRANSLATIONS.companyLegalDetails
        }</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
