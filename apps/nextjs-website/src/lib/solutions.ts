import { StrapiSolutions } from './strapi/solutions';
import { SolutionDetailsPageProps } from '@/app/solutions/[solutionSlug]/page';

export function makeSolutionsProps(
  strapiSolutions: StrapiSolutions
): ReadonlyArray<SolutionDetailsPageProps> {
  return strapiSolutions.data.map(({ attributes }) => ({
    ...attributes,
    // parts: [
    //   ...(attributes.parts
    //     .map((part) => partFromStrapiPart(part))
    //     .filter((part) => !!part) as ReadonlyArray<Part>),
    // ],
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data.attributes,
    })),
  }));
}
