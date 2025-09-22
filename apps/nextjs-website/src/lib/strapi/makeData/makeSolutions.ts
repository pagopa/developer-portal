/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { SolutionTemplateData } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';
import { makeWebinar } from '@/lib/strapi/makeData/makeWebinars';
import { compact } from 'lodash';

export function makeSolutions(
  strapiSolutions: StrapiSolutions
): readonly SolutionTemplateData[] {
  return compact(
    strapiSolutions.data.map(({ attributes }) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Solution: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }

      try {
        return {
          ...attributes,
          stats: [...attributes.stats],
          steps: attributes.steps.map((step) => ({
            ...step,
            products: step.products.data.map((product) => ({
              ...product.attributes,
            })),
          })),
          products: attributes.products.data.map(({ attributes }) => ({
            ...attributes,
            logo: attributes.logo.data?.attributes,
          })),
          icon: attributes.icon.data.attributes,
          webinars: compact(
            attributes.webinars.data.map((webinar) => makeWebinar(webinar))
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
            stories: compact(
              attributes.caseHistories.case_histories.data.map(
                (caseHistory) => {
                  if (!caseHistory.attributes.slug) {
                    console.error(
                      `Error while processing CaseHistory with title "${caseHistory.attributes.title}": missing slug. Skipping...`
                    );
                    return null;
                  }

                  return {
                    title: caseHistory.attributes.title,
                    path: `/case-histories/${caseHistory.attributes.slug}`,
                    image: caseHistory.attributes.image?.data?.attributes,
                  };
                }
              )
            ),
          },
          seo: attributes.seo,
          updatedAt: attributes.updatedAt,
        };
      } catch (error) {
        console.error(
          `Error while processing Solution with title ${attributes.title}:`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}
