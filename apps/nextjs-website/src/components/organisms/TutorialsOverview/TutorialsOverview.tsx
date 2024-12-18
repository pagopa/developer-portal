'use client';

import React from 'react';
import { Tutorial } from '@/lib/types/tutorialData';
import { Path } from '@/lib/types/path';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import { useTranslations } from 'next-intl';

type TutorialsOverviewProps = {
  title?: string;
  subtitle: string;
  ctaLabel?: string;
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
  const t = useTranslations();
  const label = t('shared.readTutorial');
  return (
    <NewsShowcase
      marginTop={8}
      title={title || t('overview.tutorial.title')}
      subtitle={subtitle}
      cta={{
        label: ctaLabel || t('overview.tutorial.ctaLabel'),
        href: tutorialPath.path,
      }}
      items={tutorials.map((tutorial) => ({
        ...tutorial,
        image: tutorial.image,
        link: {
          url: tutorial.path,
          text: label,
        },
      }))}
    />
  );
};

export default TutorialsOverview;
