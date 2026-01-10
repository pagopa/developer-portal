import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import { compact } from 'lodash';

export function makeCaseHistoriesProps(
  strapiCaseHistories: StrapiCaseHistories
): ReadonlyArray<CaseHistoryPageTemplateProps> {
  return strapiCaseHistories.data.map(({ attributes }) => ({
    ...attributes,
    updatedAt: attributes.updatedAt,
    parts: compact(attributes.parts.map((part) => makePartProps(part))),
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data?.attributes,
    })),
    image: attributes.image?.data?.attributes,
    seo: attributes.seo,
    localizations:
      attributes.localizations?.data.map((l) => ({
        locale: l.attributes.locale,
        slug: l.attributes.slug,
      })) || [],
    locale: attributes.locale,
  }));
}
