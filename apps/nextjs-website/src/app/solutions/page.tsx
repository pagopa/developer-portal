import SolutionsTemplate from '@/components/templates/SolutionsTemplate/SolutionsTemplate';
import { getSolutionsList } from '@/lib/api';

const Page = async () => {
  const solutionsList = await getSolutionsList();

  return (
    <SolutionsTemplate
      hero={solutionsList.hero}
      solutions={solutionsList.solutions}
      feature={{
        title: 'I benefici della trasformazione digitale dei servizi',
        items: [
          {
            iconName: 'MarkEmailRead',
            subtitle:
              'I cittadini hanno un accesso più diretto e immediato alle informazioni importanti e ai servizi che possono utilizzare',
            title: 'Comunicazione tempestiva e trasparente',
          },
          {
            iconName: 'ChangeCircle',
            subtitle:
              'I cittadini hanno un accesso più diretto e immediato alle informazioni importanti e ai servizi che possono utilizzare',
            title: 'Comunicazione tempestiva e trasparente',
          },
          {
            iconName: 'Timer',
            subtitle:
              'I cittadini hanno un accesso più diretto e immediato alle informazioni importanti e ai servizi che possono utilizzare',
            title: 'Comunicazione tempestiva e trasparente',
          },
        ],
      }}
      successStories={solutionsList.successStories}
    />
  );
};

export default Page;