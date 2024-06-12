import { SolutionsTemplateProps } from '@/components/templates/SolutionsTemplate/SolutionsTemplate';
import { StrapiSolutionsList } from './strapi/solutionsListCodec';

export function makeSolutionsListProps(
  strapiSolutionsList: StrapiSolutionsList
): Omit<SolutionsTemplateProps, 'feature'> {
  const {
    data: { attributes },
  } = strapiSolutionsList;
  return {
    ...strapiSolutionsList,
    hero: {
      title: attributes.title,
      subtitle: attributes.description,
    },
    solutions: attributes.solutions.data.map(({ attributes }) => ({
      name: attributes.title,
      description: attributes.description,
      logo: attributes.icon.data.attributes,
      slug: `solutions/${attributes.slug}`,
      tags: attributes.products.data.map((products) => ({
        label: products.attributes.name,
        path: `/${products.attributes.slug}`,
      })),
    })),
    successStories: attributes.caseHistories && {
      title: attributes.caseHistories.title,
      subtitle: attributes.caseHistories.description,
      stories: attributes.caseHistories.case_histories.data.map(
        (caseHistory) => ({
          title: caseHistory.attributes.title,
          path: `case-histories/${caseHistory.attributes.slug}`,
          image: caseHistory.attributes.image?.data?.attributes,
        })
      ),
    },
  };
}
