import { makeSolution } from '@/_contents/makeDocs';
import { getDetailSolutionsProps } from './cmsApi';
import { StrapiSolutions } from './strapi/solutionsCodec';
import { Solution } from './types/solution';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';

export type DetailSolutionsProps = Solution & {
  readonly solutionSlug: string;
  readonly steps?: StrapiSolutions['data'][0]['attributes']['steps'];
  readonly stats?: StrapiSolutions['data'][0]['attributes']['stats'];
  readonly webinars?: StrapiSolutions['data'][0]['attributes']['webinars'];
  readonly bannerLinks?: readonly BannerLinkProps[];
  readonly path?: string;
};

export function makeFullSolutionsProps(
  strapiSolutions: StrapiSolutions
): ReadonlyArray<SolutionTemplateProps> {
  return strapiSolutions.data.map(({ attributes }) => ({
    ...attributes,
    steps: attributes.steps.map((step) => ({
      ...step,
      products: step.products.data.map((product) => ({
        ...product.attributes,
      })),
    })),
    products: attributes.products.data.map(({ attributes }) => ({
      ...attributes,
      logo: attributes.logo.data.attributes,
    })),
    icon: attributes.icon.data.attributes,
    webinars: attributes.webinars.data.map((webinar) => ({
      ...webinar.attributes,
      startDateTime: webinar.attributes.startDatetime?.toISOString(),
      endDateTime: webinar.attributes.endDatetime?.toISOString(),
      imagePath: webinar.attributes.coverImage.data.attributes.url,
      speakers: webinar.attributes.webinarSpeakers.data.map((speaker) => ({
        ...speaker.attributes,
        avatar: speaker.attributes.avatar.data?.attributes,
      })),
    })),
    bannerLinks: attributes.bannerLinks.map((bannerLink) => ({
      ...bannerLink,
      title: bannerLink.title || '',
      icon: bannerLink.icon?.data?.attributes,
    })),
  }));
}

export function makeDetailSolutionsProps(
  strapiSolutions: StrapiSolutions
): ReadonlyArray<DetailSolutionsProps> {
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
  solutionSlug: string,
  solutionSubPathSlugs: readonly string[]
) {
  const solutionsFromStrapi = await getDetailSolutionsProps();

  const solutionFromStrapi = solutionsFromStrapi.find(
    ({ slug }) => slug === solutionSlug
  );

  if (!solutionFromStrapi) {
    return undefined;
  }

  const parsedSolutions = makeSolution(solutionFromStrapi);

  return parsedSolutions.find(
    ({ page }) =>
      page.path ===
      `/solutions/${solutionSlug}/${solutionSubPathSlugs.join('/')}`
  );
}

export function getSolutionSubPaths(
  detailSolutionsProps: DetailSolutionsProps
) {
  return makeSolution(detailSolutionsProps).map(({ page, solution }) => {
    const path = page.path.split('/').filter((_, index) => index > 2);

    return {
      solutionSlug: solution.slug,
      solutionSubPathSlugs: path,
    };
  });
}
