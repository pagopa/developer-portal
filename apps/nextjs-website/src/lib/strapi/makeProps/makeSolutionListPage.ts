/* eslint-disable functional/no-expression-statements */
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';
import _ from 'lodash';

export function makeSolutionListPageProps(
  strapiSolutionsList: StrapiSolutionListPage
): SolutionListTemplateProps {
  const {
    data: { attributes }
  } = strapiSolutionsList;
  return {
    ...strapiSolutionsList,
    hero: {
      title: attributes.title,
      subtitle: attributes.description
    },
    solutions: _.compact(
      attributes.solutions.data.map(({ attributes }) => {
        if (!attributes.slug) {
          console.error(
            `Error processing Solution "${attributes.title}": Missing solution slug. Skipping...`
          );
          return null;
        }

        return {
          name: attributes.title,
          description: attributes.description,
          logo: attributes.icon.data.attributes,
          slug: `solutions/${attributes.slug}`,
          tags: attributes.products.data.map((products) => ({
            label: products.attributes.shortName,
            path: `/${products.attributes.slug}`
          }))
        };
      })
    ),
    successStories: attributes.caseHistories && {
      title: attributes.caseHistories.title,
      subtitle: attributes.caseHistories.description,
      stories: _.compact(
        attributes.caseHistories.case_histories.data.map((caseHistory) => {
          if (!caseHistory.attributes.slug) {
            console.error(
              `Error processing Case History "${caseHistory.attributes.title}": Missing case history slug. Skipping...`
            );
            return null;
          }

          return {
            title: caseHistory.attributes.title,
            path: `case-histories/${caseHistory.attributes.slug}`,
            image: caseHistory.attributes.image?.data?.attributes
          };
        })
      )
    },
    features: attributes.features && {
      title: attributes.features.title,
      items: attributes.features.items.map((item) => ({
        title: item.title ?? '',
        content: item.content,
        iconUrl: item.icon.data.attributes.url
      }))
    },
    seo: attributes.seo
  };
}
