/* eslint-disable functional/no-expression-statements */
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';
import { compact } from 'lodash';

export function makeSolutionListPageProps(
  strapiSolutionsList: StrapiSolutionListPage
): SolutionListTemplateProps {
  return {
    ...strapiSolutionsList,
    hero: {
      title: strapiSolutionsList.title,
      subtitle: strapiSolutionsList.description,
    },
    solutions: compact(
      strapiSolutionsList.solutions.map((attributes) => {
        if (!attributes.slug) {
          console.error(
            `Error while processing Solution with title "${attributes.title}": missing slug. Skipping...`
          );
          return null;
        }

        return {
          name: attributes.title,
          description: attributes.description,
          logo: attributes.icon,
          slug: `solutions/${attributes.slug}`,
          labels: attributes.products.map((products) => ({
            label: products.shortName,
            path: `/${products.slug}`,
          })),
        };
      })
    ),
    successStories: strapiSolutionsList.caseHistories && {
      title: strapiSolutionsList.caseHistories.title,
      subtitle: strapiSolutionsList.caseHistories.description,
      stories: compact(
        strapiSolutionsList.caseHistories.case_histories.map((caseHistory) => {
          if (!caseHistory.slug) {
            console.error(
              `Error while processing CaseHistory with title "${caseHistory.title}": missing slug. Skipping...`
            );
            return null;
          }

          return {
            title: caseHistory.title,
            path: `case-histories/${caseHistory.slug}`,
            image: caseHistory.image,
          };
        })
      ),
    },
    features: strapiSolutionsList.features && {
      title: strapiSolutionsList.features.title,
      items: strapiSolutionsList.features.items.map((item) => ({
        title: item.title ?? '',
        content: item.content,
        iconUrl: item.icon.url,
      })),
    },
    seo: strapiSolutionsList.seo,
  };
}
