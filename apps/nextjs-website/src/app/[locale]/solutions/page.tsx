import SolutionListTemplate from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { getSolutionListPage } from '@/lib/api';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { baseUrl } from '@/config';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'Soluzioni',
    url: `${baseUrl}/solutions`,
    locale: 'it_IT',
  });
}

export const dynamic = 'force-dynamic';

const Page = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  const solutionsList = await getSolutionListPage();

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: solutionsList.seo?.metaTitle,
        item: getItemFromPaths(params.locale, ['solutions']),
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
