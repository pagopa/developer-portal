'use client';

import React from 'react';
import { Tutorial } from '@/lib/types/tutorialData';
import { Path } from '@/lib/types/path';
import NewsShowcase from '@/components/organisms/News/NewsShowcase';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('shared');
  const label = t('readTutorial');
  return (
    <NewsShowcase
      marginTop={8}
      title={title}
      subtitle={subtitle}
      cta={{
        label: ctaLabel,
        href: tutorialPath.path,
      }}
      items={tutorials.map((tutorial) => ({
        ...tutorial,
        link: {
          url: tutorial.path,
          text: label,
        },
      }))}
    />
  );
};

export default TutorialsOverview;
