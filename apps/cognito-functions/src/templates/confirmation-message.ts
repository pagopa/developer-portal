import { renderPrecompiledTemplate } from './render-precompiled-template';
import { EMAIL_TEMPLATE_PLACEHOLDERS } from './template-sources';
import { DEFAULT_LOCALE } from '../i18n/locales';

export const makeConfirmationEmail = (
  confirmationLink: string,
  domain: string,
  locale = DEFAULT_LOCALE
): string => {
  return renderPrecompiledTemplate('confirmation', locale, {
    [EMAIL_TEMPLATE_PLACEHOLDERS.confirmationLink]: confirmationLink,
    [EMAIL_TEMPLATE_PLACEHOLDERS.domain]: domain,
  });
};
