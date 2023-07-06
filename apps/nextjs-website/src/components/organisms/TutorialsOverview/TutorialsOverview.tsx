import React from 'react';
import { translations } from '@/_contents/translations';
import { Tutorial } from '@/lib/types/tutorialData';
import { Path } from '@/lib/types/path';
import News from '@/components/organisms/News/News';

type TutorialsOverviewProps = {
  tutorialPath: Path;
  tutorials: Tutorial[];
};

const TutorialsOverview = ({
  tutorials,
  tutorialPath,
}: TutorialsOverviewProps) => {
  const { overview, shared } = translations;
  return (
    <News
      marginTop={6}
      title={overview.tutorial.title}
      subtitle={overview.tutorial.subtitle}
      ctaLabel={overview.tutorial.ctaLabel}
      href={tutorialPath.path}
      cards={tutorials.map((tutorial) => ({
        ...tutorial,
        href: {
          label: shared.readTutorial,
          link: tutorial.path,
          title: shared.readTutorial,
        },
      }))}
    />
  );
};

export default TutorialsOverview;
