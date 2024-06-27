import { makeSolution } from '@/_contents/makeDocs';
import { getSolutionsProps } from './cmsApi';
import { StrapiSolutions } from './strapi/solutions';
import { Solution } from './types/solutionData';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';

export type SolutionsProps = Solution & {
  readonly solutionSlug: string;
  readonly steps?: StrapiSolutions['data'][0]['attributes']['steps'];
  readonly stats?: StrapiSolutions['data'][0]['attributes']['stats'];
  readonly webinars?: StrapiSolutions['data'][0]['attributes']['webinars'];
  readonly bannerLinks?: readonly BannerLinkProps[];
  readonly path?: string;
};

export function makeSolutionsProps(
  strapiSolutions: StrapiSolutions
): ReadonlyArray<SolutionsProps> {
  return strapiSolutions.data.map(({ attributes }) => ({
    ...attributes,
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data.attributes,
    })),
    icon: attributes.icon.data.attributes.url,
    solutionSlug: attributes.slug,
    bannerLinks: attributes.bannerLinks.map((bannerLink) => ({
      ...bannerLink,
      icon: bannerLink.icon.data?.attributes,
    })),
    path: `/solutions/${attributes.slug}/details`,
  }));
}

export async function getSolution(
  solutionSlug?: string,
  solutionDetailsPage?: ReadonlyArray<string>
) {
  const solutionsFromStrapi = await getSolutionsProps();

  const solutionFromStrapi = solutionsFromStrapi.find(
    ({ slug }) => slug === solutionSlug
  );

  if (!solutionFromStrapi) {
    return undefined;
  }

  const parsedSolutions = makeSolution({
    solution: solutionFromStrapi,
    bannerLinks: solutionFromStrapi?.bannerLinks ?? [],
  });

  return solutionDetailsPage
    ? parsedSolutions.find(
        ({ page }) =>
          page.path ===
          `/solutions/${solutionSlug}/details/${solutionDetailsPage.join('/')}`
      )
    : parsedSolutions.find(({ page }) => page.isIndex);
}
