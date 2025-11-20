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
      title: strapiSolutionsList.data.title,
      subtitle: strapiSolutionsList.data.description,
    },
    solutions: compact(
      strapiSolutionsList.data.solutions.data.map((attributes) => {
        if (!attributes.slug) {
          console.error(
            `Error while processing Solution with title "${attributes.title}": missing slug. Skipping...`
          );
          return null;
        }

        return {
          name: attributes.title,
          description: attributes.description,
          logo: attributes.icon.data,
          slug: `solutions/${attributes.slug}`,
          labels: attributes.products.data.map((products) => ({
            label: products.shortName,
            path: `/${products.slug}`,
          })),
        };
      })
    ),
    successStories: strapiSolutionsList.data.caseHistories && {
      title: strapiSolutionsList.data.caseHistories.title,
      subtitle: strapiSolutionsList.data.caseHistories.description,
      stories: compact(
        strapiSolutionsList.data.caseHistories.case_histories.data.map(
          (caseHistory) => {
            if (!caseHistory.slug) {
              console.error(
                `Error while processing CaseHistory with title "${caseHistory.title}": missing slug. Skipping...`
              );
              return null;
            }

            return {
              title: caseHistory.title,
              path: `case-histories/${caseHistory.slug}`,
              image: caseHistory.image?.data,
            };
          }
        )
      ),
    },
    features: strapiSolutionsList.data.features && {
      title: strapiSolutionsList.data.features.title,
      items: strapiSolutionsList.data.features.items.map((item) => ({
        title: item.title ?? '',
        content: item.content,
        iconUrl: item.icon.data.url,
      })),
    },
    seo: strapiSolutionsList.data.seo,
  };
}
