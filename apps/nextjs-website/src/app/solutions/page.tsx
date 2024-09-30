import SolutionListTemplate from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { getSolutionListPage } from '@/lib/api';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { getItemFromPaths } from '@/helpers/structuredData.helpers';

const Page = async () => {
  const solutionsList = await getSolutionListPage();

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
