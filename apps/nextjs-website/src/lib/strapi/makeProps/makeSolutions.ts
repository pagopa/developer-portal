/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';
import { makeWebinarProps } from '@/lib/strapi/makeProps/makeWebinars';
import { compact } from 'lodash';

export function makeSolutionsProps(
  strapiSolutions: StrapiSolutions
): ReadonlyArray<SolutionTemplateProps> {
  return compact(
    strapiSolutions?.data.map((attributes) => {
      if (!attributes.slug || !attributes.title) {
        console.error(
          `Error while processing Solution: missing title or slug. Title: ${attributes.title} | Slug: ${attributes.slug}. Skipping...`
        );
        return null;
      }
      try {
        return {
          ...attributes,
          stats: [...(attributes.stats || [])], // Aggiunto fallback array vuoto
          steps: attributes.steps?.map((step) => ({
            ...step,
            products: step.products?.map((product) => ({
              ...product,
            })),
          })),
          products: attributes.products?.map((attributes) => ({
            ...attributes,
            logo: attributes.logo,
          })),
          icon: attributes.icon,
          webinars: compact(
            attributes.webinars?.map((webinar) => makeWebinarProps(webinar))
          ),
          bannerLinks: attributes.bannerLinks?.map((bannerLink) => ({
            ...bannerLink,
            title: bannerLink.title || '',
            icon: bannerLink.icon,
          })),
          solutionSlug: attributes.slug,
          path: `/solutions/${attributes.slug}/details`,
          successStories: attributes.caseHistories && {
            title: attributes.caseHistories.title,
            subtitle: attributes.caseHistories.description,
            stories: compact(
              attributes.caseHistories.case_histories?.map((caseHistory) => {
                if (!caseHistory.slug) {
                  console.error(
                    `Error while processing CaseHistory with title "${caseHistory.title}": missing slug. Skipping...`
                  );
                  return null;
                }

                return {
                  title: caseHistory.title,
                  path: `/case-histories/${caseHistory.slug}`,
                  image: caseHistory.image,
                };
              })
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
