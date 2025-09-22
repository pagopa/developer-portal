import { CaseHistoryPageTemplateData } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { PartData } from '../../types/part';
import { makePart } from '@/lib/strapi/makeProps/makePart';
import { StrapiPart } from '@/lib/strapi/types/part';
import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';

export function makeCaseHistories(
  strapiCaseHistories: StrapiCaseHistories
): ReadonlyArray<CaseHistoryPageTemplateData> {
  return strapiCaseHistories.data.map(({ attributes }) => ({
    ...attributes,
    updatedAt: attributes.updatedAt,
    parts: [
      ...(attributes.parts
        .map((part) => makePart(part as StrapiPart))
        .filter((part) => !!part) as ReadonlyArray<PartData>),
    ],
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data?.attributes,
    })),
    image: attributes.image?.data?.attributes,
    seo: attributes.seo,
  }));
}
