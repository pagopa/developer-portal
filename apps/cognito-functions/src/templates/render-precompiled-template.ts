import { sanitize } from '../utils/sanitize';
import { PRECOMPILED_EMAIL_TEMPLATES } from './generated/precompiled-email-templates';
import { DEFAULT_LOCALE } from '../i18n/locales';

type EmailTemplateId = keyof typeof PRECOMPILED_EMAIL_TEMPLATES;

type TemplateReplacements = Readonly<Record<string, string>>;

const replacePlaceholder = (
  template: string,
  placeholder: string,
  value: string
): string => template.split(placeholder).join(sanitize(value));

export const renderPrecompiledTemplate = (
  templateId: EmailTemplateId,
  locale: string,
  replacements: TemplateReplacements
): string => {
  const localizedTemplate =
    PRECOMPILED_EMAIL_TEMPLATES[templateId][
      locale as keyof (typeof PRECOMPILED_EMAIL_TEMPLATES)[typeof templateId]
    ] || PRECOMPILED_EMAIL_TEMPLATES[templateId][DEFAULT_LOCALE];

  return Object.keys(replacements).reduce(
    (template, placeholder) =>
      replacePlaceholder(template, placeholder, replacements[placeholder]),
    localizedTemplate
  );
};
