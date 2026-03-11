import { renderPrecompiledTemplate } from './render-precompiled-template';
import { EMAIL_TEMPLATE_PLACEHOLDERS } from './template-sources';

export const makeConfirmationUpdateEmailAddress = (
  confirmationLink: string,
  domain: string,
  locale = 'it'
): string => {
  return renderPrecompiledTemplate('confirmationUpdateEmailAddress', locale, {
    [EMAIL_TEMPLATE_PLACEHOLDERS.confirmationLink]: confirmationLink,
    [EMAIL_TEMPLATE_PLACEHOLDERS.domain]: domain,
  });
};
