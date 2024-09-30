import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { StrapiCaseHistories } from '../codecs/CaseHistoriesCodec';
import { Part } from '../../types/part';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';

export function makeCaseHistoriesProps(
  strapiCaseHistories: StrapiCaseHistories
): ReadonlyArray<CaseHistoryPageTemplateProps> {
  return strapiCaseHistories.data.map(({ attributes }) => ({
    ...attributes,
    parts: [
      ...(attributes.parts
        .map((part) => makePartProps(part))
        .filter((part) => !!part) as ReadonlyArray<Part>),
    ],
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data.attributes,
    })),
    image: attributes.image?.data?.attributes,
    seo: attributes.seo,
  }));
}
