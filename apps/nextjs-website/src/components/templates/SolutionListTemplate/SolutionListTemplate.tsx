'use client';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import SolutionsShowcase from '@/components/organisms/SolutionsShowcase/SolutionsShowcase';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';
import Hero from '@/editorialComponents/Hero/Hero';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { useTranslations } from 'next-intl';

export type SolutionListTemplateProps = {
  hero: {
    backgroundImage?: string;
    altText?: string;
    title: string;
    subtitle: string;
  };
  solutions: {
    name: string;
    description?: string;
    slug: string;
    tags?: { label: string; path?: string }[];
    logo: Media;
  }[];
  features?: {
    title: string;
    subtitle?: string;
    items: FeatureItem[];
  };
  successStories?: {
    title: string;
    subtitle?: string;
    stories: {
      title: string;
      publishedAt?: Date;
      path: string;
      image?: {
        url: string;
        alternativeText?: string;
      };
    }[];
  };
};

const SolutionListTemplate = ({
  hero,
  solutions,
  features,
  successStories,
}: SolutionListTemplateProps) => {
  const t = useTranslations();

  return (
    <>
      <Hero
        background={hero.backgroundImage}
        title={hero.title}
        subtitle={hero.subtitle}
        size='small'
        smallHeight='fit-content'
        useHoverlay={false}
        altText={hero.altText}
        theme='light'
        gridTextSx={{ marginTop: { xs: '62px', md: '77px' } }}
      />
      {solutions && solutions.length > 0 && (
        <SolutionsShowcase
          py={4}
          cards={solutions.map((solution) => ({
            title: solution.name,
            text: solution.description || '',
            href: solution.slug,
            logoUrl: solution.logo.url,
            tags: solution.tags,
          }))}
        />
      )}
      {features && (
        <Feature items={features.items} title={features.title} useDarkTheme />
      )}
      {successStories && (
        <NewsShowcase
          marginTop={8}
          newsMarginTop={4}
          title={successStories.title}
          subtitle={successStories.subtitle}
          items={successStories.stories.map((story) => ({
            ...story,
            link: {
              url: story.path,
              text: t('shared.readStory'),
            },
          }))}
        />
      )}
    </>
  );
};

export default SolutionListTemplate;
