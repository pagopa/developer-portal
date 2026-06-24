import { renderPrecompiledTemplate } from './render-precompiled-template';
import { EMAIL_TEMPLATE_PLACEHOLDERS } from './template-sources';
import { DEFAULT_LOCALE } from '../i18n/locales';

export const makePostConfirmationConfirmSignUpEmail = (
  firstName: string,
  domain: string,
  locale = DEFAULT_LOCALE
): string => {
  return renderPrecompiledTemplate('postConfirmation', locale, {
    [EMAIL_TEMPLATE_PLACEHOLDERS.domain]: domain,
    [EMAIL_TEMPLATE_PLACEHOLDERS.firstName]: firstName,
    [EMAIL_TEMPLATE_PLACEHOLDERS.loginUrl]: `https://${domain}/${locale}/auth/login`,
  });
};
