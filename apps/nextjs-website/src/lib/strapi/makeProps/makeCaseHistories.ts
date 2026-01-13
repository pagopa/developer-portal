import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import { compact } from 'lodash';

export function makeCaseHistoriesProps(
  strapiCaseHistories: StrapiCaseHistories
): ReadonlyArray<CaseHistoryPageTemplateProps> {
  return strapiCaseHistories.data.map(({ attributes }) => ({
    ...attributes,
    locale: 'it', // Temporary hardcoded value until we have localization in Strapi
    updatedAt: attributes.updatedAt,
    parts: compact(attributes.parts.map((part) => makePartProps(part))),
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data?.attributes,
    })),
    image: attributes.image?.data?.attributes,
    seo: attributes.seo,
  }));
}
