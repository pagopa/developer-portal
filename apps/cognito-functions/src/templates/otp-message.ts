import { EMAIL_TRANSLATIONS } from './translations';
import { renderPrecompiledTemplate } from './render-precompiled-template';
import { EMAIL_TEMPLATE_PLACEHOLDERS } from './template-sources';

export const makeOtpMessageEmail = (
  otp: string,
  domain: string,
  codeDurationMinutes: number,
  locale = 'it'
): string => {
  const translations =
    EMAIL_TRANSLATIONS.otp[locale as keyof typeof EMAIL_TRANSLATIONS.otp] ||
    EMAIL_TRANSLATIONS.otp.it;
  return renderPrecompiledTemplate('otp', locale, {
    [EMAIL_TEMPLATE_PLACEHOLDERS.codeDuration]:
      translations.codeDuration(codeDurationMinutes),
    [EMAIL_TEMPLATE_PLACEHOLDERS.domain]: domain,
    [EMAIL_TEMPLATE_PLACEHOLDERS.otp]: otp,
  });
};
