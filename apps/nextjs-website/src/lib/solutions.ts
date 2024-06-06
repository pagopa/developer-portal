// import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
// import { partFromStrapiPart } from './strapi/codecs/PartCodec';
// import { Part } from './types/part';
// import { StrapiSolutions } from './strapi/solutionsCodec';

// export function makeSolutionsProps(
//   srapiSolutions: StrapiSolutions
// ): ReadonlyArray<> {
//   return srapiSolutions.data.map(({ attributes }) => ({
//     ...attributes,
//     parts: [
//       ...(attributes.parts
//         .map((part) => partFromStrapiPart(part))
//         .filter((part) => !!part) as ReadonlyArray<Part>),
//     ],
//     products: attributes.products.data.map(({ attributes }) => ({
//       ...attributes,
//       logo: attributes.logo.data.attributes,
//     })),
//   }));
// }
