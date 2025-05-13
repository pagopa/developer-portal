import SolutionListTemplate from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { getSolutionListPage } from '@/lib/api';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { baseUrl } from '@/config';
import { cache } from 'react';

// Set revalidation time to 1 hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'Soluzioni',
    url: `${baseUrl}/solutions`,
    locale: 'it_IT',
  });
}

// Cache solution list page data fetching
const getCachedSolutionListPage = cache(async () => {
  const solutionsList = await getSolutionListPage();
  return solutionsList;
});

const Page = async () => {
  const solutionsList = await getCachedSolutionListPage();

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: solutionsList.seo?.metaTitle,
        item: getItemFromPaths(['solutions']),
      },
    ],
    seo: solutionsList.seo,
  });

  return (
    <>
      {structuredData}
      <SolutionListTemplate
        hero={solutionsList.hero}
        solutions={solutionsList.solutions}
        features={solutionsList.features}
        successStories={solutionsList.successStories}
      />
    </>
  );
};

export default Page;
