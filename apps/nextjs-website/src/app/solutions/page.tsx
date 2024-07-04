import SolutionsTemplate from '@/components/templates/SolutionsTemplate/SolutionsTemplate';
import { getSolutionsList } from '@/lib/api';

const Page = async () => {
  const solutionsList = await getSolutionsList();

  return (
    <SolutionsTemplate
      hero={solutionsList.hero}
      solutions={solutionsList.solutions}
      features={solutionsList.features}
      successStories={solutionsList.successStories}
    />
  );
};

export default Page;
