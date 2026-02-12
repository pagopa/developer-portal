/* eslint-disable functional/no-expression-statements */
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';
import { compact } from 'lodash';

export function makeSolutionListPageProps(
  locale: string,
  strapiSolutionsList: StrapiSolutionListPage
): SolutionListTemplateProps {
  const {
    data: { attributes },
  } = strapiSolutionsList;
  return {
    ...strapiSolutionsList,
    hero: {
      title: attributes.title,
      subtitle: attributes.description,
    },
    solutions: compact(
      attributes.solutions.data.map(({ attributes }) => {
        if (!attributes.slug) {
          console.error(
            `Error while processing Solution with title "${attributes.title}": missing slug. Skipping...`
          );
          return null;
        }

        return {
          name: attributes.title,
          description: attributes.description,
          logo: attributes.icon.data.attributes,
          slug: `solutions/${attributes.slug}`,
          labels: attributes.products.data.map((products) => ({
            label: products.attributes.shortName,
            path: `/${locale}/${products.attributes.slug}`,
          })),
        };
      })
    ),
    successStories: attributes.caseHistories && {
      title: attributes.caseHistories.title,
      subtitle: attributes.caseHistories.description,
      stories: compact(
        attributes.caseHistories.case_histories.data.map((caseHistory) => {
          if (!caseHistory.attributes.slug) {
            console.error(
              `Error while processing CaseHistory with title "${caseHistory.attributes.title}": missing slug. Skipping...`
            );
            return null;
          }

          return {
            title: caseHistory.attributes.title,
            path: `/${locale}/case-histories/${caseHistory.attributes.slug}`,
            image: caseHistory.attributes.image?.data?.attributes,
          };
        })
      ),
    },
    features: attributes.features && {
      title: attributes.features.title,
      items: attributes.features.items.map((item) => ({
        title: item.title ?? '',
        content: item.content,
        iconUrl: item.icon.data.attributes.url,
      })),
    },
    seo: attributes.seo,
  };
}
