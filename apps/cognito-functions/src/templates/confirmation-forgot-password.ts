import { COMPANY_LOGO } from './company-logo';
import { parseMjmlToHtml } from './mjmlParser';

const TRANSLATIONS = {
  previewText: 'Password dimenticata',
  title: 'Password dimenticata',
  text: 'Ci risulta che tu abbia richiesto di impostare una nuova password per PagoPA DevPortal. Se è così, usa il bottone qui sotto per procedere. ',
  setNewPassword: 'Imposta nuova password',
  companyLegalDetails:
    'PagoPA S.p.A. - Società per azioni con socio unico capitale sociale di euro 1,000,000 i.v.Sede legale in Roma, Piazza Colonna 370, CAP 00187Sede operativa in Roma, Via Sardegna 38, CAP 00187N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009',
  wrongRecipient:
    'Ricevi questa e-mail perché hai creato un account su PagoPA DevPortal.<br>Non sei tu? Ignora o cancella questa e-mail.',
  buttonFallbackText: 'Il bottone non funziona? Puoi usare il seguente link:',
};

export const makeConfirmationForgotPasswordEmail = (
  confirmationLink: string
): string => parseMjmlToHtml(confirmationMessage(confirmationLink));

const confirmationMessage = (newPasswordLink: string): string => `
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
      @media (min-width:760px) {
        .container > table > tbody > tr > td {
          padding: 22px 90px 0 0;
        }
      }
      .box-shadow {
        box-shadow: 0px 0px 45px 0px #0000001A;
      }
      .link a:link, .link a:visited, .link a:focus, .link a:hover, .link a:active {
        text-decoration: none;
        color: #0073E6;
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
        <mj-text>
          ${COMPANY_LOGO}
        </mj-text>
      </mj-column>
      <mj-column width="100%">
        <mj-text mj-class="title" align="left" color="#17324D" font-size="32px">${TRANSLATIONS.title}</mj-text>
      </mj-column>
      <mj-column css-class="container" width="100%" padding-top="22px">
        <mj-text mj-class="text" font-size="18px">${TRANSLATIONS.text}</mj-text>
        <mj-button align="left" background-color="#0073E6" href="${newPasswordLink}" font-size="16px" font-weight="700">
          ${TRANSLATIONS.setNewPassword}
        </mj-button>
        <mj-text mj-class="text link" font-size="14px">${TRANSLATIONS.buttonFallbackText}<br><a href="${newPasswordLink}">${newPasswordLink}</a></mj-text>
        <mj-spacer height="5px" />
        <mj-divider border-width="1px" border-style="solid" border-color="#E3E7EB" />
        <mj-spacer height="5px" />
        <mj-text mj-class="text" font-size="14px">${TRANSLATIONS.wrongRecipient}</mj-text>
        <mj-text mj-class="footer-text">${TRANSLATIONS.companyLegalDetails}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
