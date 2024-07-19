import SolutionListTemplate from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { getSolutionsList } from '@/lib/api';

const Page = async () => {
  const solutionsList = await getSolutionsList();

  return (
    <SolutionListTemplate
      hero={solutionsList.hero}
      solutions={solutionsList.solutions}
      features={solutionsList.features}
      successStories={solutionsList.successStories}
    />
  );
};

export default Page;
