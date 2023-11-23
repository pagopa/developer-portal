import { parseMjmlToHtml } from './mjmlParser';

const TRANSLATIONS = {
  previewText: 'Ecco il tuo OTP',
  title: 'Ecco il tuo OTP',
  text: 'Per poter accedere al Developer Portal, inserisci il seguente codice',
  companyLegalDetails:
    'PagoPA S.p.A. - Società per azioni con socio unico capitale sociale di euro 1,000,000 i.v.Sede legale in Roma, Piazza Colonna 370, CAP 00187Sede operativa in Roma, Via Sardegna 38, CAP 00187N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009',
};

export const makeOtpMessageEmail = (otp: string, domain: string): string =>
  parseMjmlToHtml(otpMessage(otp, domain));

const otpMessage = (otp: string, domain: string): string => `
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
        border: 1px solid #fefefe;
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
        <mj-image align="left" src="https://${domain}/images/logo-pago-pa.png" alt="PagoPA" width="114px" height="33px" />
      </mj-column>
      <mj-column width="100%">
        <mj-text mj-class="title" align="left" color="#17324D" font-size="32px">${TRANSLATIONS.title}</mj-text>
      </mj-column>
      <mj-column css-class="container" width="100%" padding-top="22px">
        <mj-text mj-class="text" font-size="18px">${TRANSLATIONS.text}</mj-text>
        <mj-text align="center"><strong>${otp}</strong></mj-text>
        <mj-spacer height="5px" />
        <mj-divider border-width="1px" border-style="solid" border-color="#E3E7EB" />
        <mj-spacer height="5px" />
        <mj-text mj-class="footer-text">${TRANSLATIONS.companyLegalDetails}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
