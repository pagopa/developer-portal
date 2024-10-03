import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { StrapiSolutionListPage } from '../codecs/SolutionListPageCodec';

export function makeSolutionListPageProps(
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
    solutions: attributes.solutions.data.map(({ attributes }) => ({
      name: attributes.title,
      description: attributes.description,
      logo: attributes.icon.data.attributes,
      slug: `solutions/${attributes.slug}`,
      tags: attributes.products.data.map((products) => ({
        label: products.attributes.shortName,
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
