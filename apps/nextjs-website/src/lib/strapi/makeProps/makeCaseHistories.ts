import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import { compact } from 'lodash';

export function makeCaseHistoriesProps(
  strapiCaseHistories: StrapiCaseHistories
): ReadonlyArray<CaseHistoryPageTemplateProps> {
  return strapiCaseHistories.data.map((attributes) => ({
    ...attributes,
    updatedAt: attributes.updatedAt,
    parts: compact(attributes.parts.map((part) => makePartProps(part))),
    products: attributes.products.map((attributes) => ({
      ...attributes,
      logo: attributes.logo,
    })),
    image: attributes.image,
    seo: attributes.seo,
  }));
}
