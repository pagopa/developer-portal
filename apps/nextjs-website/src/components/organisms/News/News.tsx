import React from 'react';
import { translations } from '@/_contents/translations';
import { Newsroom } from '@pagopa/pagopa-editorial-components';
import SectionTitle from '@/components/molecules/SectionTitle/SectionTitle';
import { Tutorial } from '@/lib/types/tutorialData';
import { Path } from '@/lib/types/path';

type NewsProps = {
  tutorialPath: Path;
  tutorials: Tutorial[];
};

const News = ({ tutorials, tutorialPath }: NewsProps) => {
  const { overview, shared } = translations;
  return (
    <>
      <SectionTitle
        title={overview.tutorial.title}
        subtitle={overview.tutorial.subtitle}
        ctaLabel={overview.tutorial.ctaLabel}
        href={tutorialPath.path}
      />
      <Newsroom
        items={tutorials.map((tutorial) => ({
          date: {
            date: new Date(tutorial.dateString),
          },
          href: {
            label: shared.readTutorial,
            link: tutorial.path,
            title: shared.readTutorial,
          },
          img: {
            alt: tutorial.image?.alt || '',
            src: tutorial.image?.url || '/images/news.png',
          },
          title: tutorial.title,
        }))}
      />
    </>
  );
};

export default News;
