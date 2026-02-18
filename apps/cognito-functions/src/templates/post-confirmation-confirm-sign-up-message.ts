import { parseMjmlToHtml } from './mjmlParser';
import { EMAIL_TRANSLATIONS } from './translations';

export const makePostConfirmationConfirmSignUpEmail = (
  firstName: string,
  domain: string,
  locale = 'it'
): string =>
  parseMjmlToHtml(
    postConfirmationConfirmSignUpMessage(firstName, domain, locale)
  );

const postConfirmationConfirmSignUpMessage = (
  firstName: string,
  domain: string,
  locale: string
): string => {
  const translations =
    EMAIL_TRANSLATIONS.postConfirmation[
      locale as keyof typeof EMAIL_TRANSLATIONS.postConfirmation
    ] || EMAIL_TRANSLATIONS.postConfirmation.it;
  const commonTranslations =
    EMAIL_TRANSLATIONS.common[
      locale as keyof typeof EMAIL_TRANSLATIONS.common
    ] || EMAIL_TRANSLATIONS.common.it;

  return `
<mjml>
  <mj-head>
    <mj-preview>${translations.previewText}</mj-preview>
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
        <mj-image align="left" src="https://${domain}/images/logo-pago-pa.png" alt="PagoPA" width="114px" height="33px" />
      </mj-column>
      <mj-column width="100%">
        <mj-text mj-class="title" align="left" color="#17324D" font-size="32px">${
          translations.title
        }</mj-text>
      </mj-column>
      <mj-column css-class="container" width="100%" padding-top="22px">
        <mj-text mj-class="text" font-size="18px">${
          translations.hello
        } ${firstName},</mj-text>
        <mj-spacer height="36px" />
        <mj-text mj-class="text" font-size="18px">${translations.text}</mj-text>
        <mj-button align="left" background-color="#0073E6" href="${`https://${domain}/auth/login`}" font-size="16px" font-weight="700">
          ${translations.goToLogin}
        </mj-button>
        <mj-spacer height="48px" />
        <mj-text mj-class="text" font-size="18px">${
          translations.seeYouSoon
        }</mj-text>
        <mj-spacer height="5px" />
        <mj-divider border-width="1px" border-style="solid" border-color="#E3E7EB" />
        <mj-spacer height="5px" />
        <mj-text mj-class="text" font-size="14px">${
          translations.wrongRecipient
        }</mj-text>
        <mj-text mj-class="footer-text">${
          commonTranslations.companyLegalDetails
        }</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
};
