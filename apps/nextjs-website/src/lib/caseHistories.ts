import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { StrapiCaseHistories } from './strapi/caseHistoriesCodec';
import { partFromStrapiPart } from './strapi/codecs/PartCodec';
import { Part } from './types/part';

export function makeCaseHistoriesProps(
  srapiCaseHistories: StrapiCaseHistories
): ReadonlyArray<CaseHistoryPageTemplateProps> {
  return srapiCaseHistories.data.map(({ attributes }) => ({
    ...attributes,
    parts: [
      ...(attributes.parts
        .map((part) => partFromStrapiPart(part))
        .filter((part) => !!part) as ReadonlyArray<Part>),
    ],
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data.attributes,
    })),
  }));
}
