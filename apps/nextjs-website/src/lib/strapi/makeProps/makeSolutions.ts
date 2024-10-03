import { StrapiSolutions } from '../codecs/SolutionsCodec';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { makeWebinarFromStrapi } from './makeWebinars';

export function makeSolutionsProps(
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
    webinars: attributes.webinars.data.map((webinar) =>
      makeWebinarFromStrapi(webinar)
    ),
    bannerLinks: attributes.bannerLinks.map((bannerLink) => ({
      ...bannerLink,
      title: bannerLink.title || '',
      icon: bannerLink.icon?.data?.attributes,
    })),
    solutionSlug: attributes.slug,
    path: `/solutions/${attributes.slug}/details`,
    successStories: attributes.caseHistories && {
      title: attributes.caseHistories.title,
      subtitle: attributes.caseHistories.description,
      stories: attributes.caseHistories.case_histories.data.map(
        (caseHistory) => ({
          title: caseHistory.attributes.title,
          path: `/case-histories/${caseHistory.attributes.slug}`,
          image: caseHistory.attributes.image?.data?.attributes,
        })
      ),
    },
    seo: attributes.seo,
  }));
}
