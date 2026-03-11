import { renderPrecompiledTemplate } from './render-precompiled-template';
import { EMAIL_TEMPLATE_PLACEHOLDERS } from './template-sources';
import { DEFAULT_LOCALE } from '../i18n/locales';

export const makeConfirmationForgotPasswordEmail = (
  confirmationLink: string,
  domain: string,
  locale = DEFAULT_LOCALE
): string => {
  return renderPrecompiledTemplate('confirmationForgotPassword', locale, {
    [EMAIL_TEMPLATE_PLACEHOLDERS.confirmationLink]: confirmationLink,
    [EMAIL_TEMPLATE_PLACEHOLDERS.domain]: domain,
  });
};
