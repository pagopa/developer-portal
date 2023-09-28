'use client';

import React from 'react';
import { translations } from '@/_contents/translations';
import { Tutorial } from '@/lib/types/tutorialData';
import { Path } from '@/lib/types/path';
import News from '@/components/organisms/News/News';

type TutorialsOverviewProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  tutorialPath: Path;
  tutorials: Tutorial[];
};

const TutorialsOverview = ({
  title,
  subtitle,
  ctaLabel,
  tutorials,
  tutorialPath,
}: TutorialsOverviewProps) => {
  const { shared } = translations;
  return (
    <News
      marginTop={8}
      title={title}
      subtitle={subtitle}
      cta={{
        label: ctaLabel,
        href: tutorialPath.path,
      }}
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
