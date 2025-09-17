import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { Part } from '../../types/part';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { StrapiPart } from '@/lib/strapi/types/part';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';

export function makeCaseHistoriesProps(
  strapiCaseHistories: StrapiCaseHistories,
): ReadonlyArray<CaseHistoryPageTemplateProps> {
  return strapiCaseHistories.data.map(({ attributes }) => ({
    ...attributes,
    updatedAt: attributes.updatedAt,
    parts: [
      ...(attributes.parts
        .map((part) => makePartProps(part as StrapiPart))
        .filter((part) => !!part) as ReadonlyArray<Part>),
    ],
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data?.attributes,
    })),
    image: attributes.image?.data?.attributes,
    seo: attributes.seo,
  }));
}
