/* eslint-disable functional/no-expression-statements */
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';
import { compact } from 'lodash';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export function makeSolutionListPageProps(
  strapiSolutionsList: RootEntity<StrapiSolutionListPage>
): SolutionListTemplateProps {
  const strapiSolutionsListData = strapiSolutionsList.data;
  return {
    ...strapiSolutionsList,
    hero: {
      title: strapiSolutionsListData.title,
      subtitle: strapiSolutionsListData.description,
    },
    solutions: compact(
      strapiSolutionsListData.solutions.map((attributes) => {
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
    successStories: strapiSolutionsListData.caseHistories && {
      title: strapiSolutionsListData.caseHistories.title,
      subtitle: strapiSolutionsListData.caseHistories.description,
      stories: compact(
        strapiSolutionsListData.caseHistories.case_histories.map(
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
              image: caseHistory.image,
            };
          }
        )
      ),
    },
    features: strapiSolutionsListData.features && {
      title: strapiSolutionsListData.features.title,
      items: strapiSolutionsListData.features.items.map((item) => ({
        title: item.title ?? '',
        content: item.content,
        iconUrl: item.icon.url,
      })),
    },
    seo: strapiSolutionsListData.seo,
  };
}
