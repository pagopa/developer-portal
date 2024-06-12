'use client';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import SolutionsShowcase from '@/components/organisms/SolutionsShowcase/SolutionsShowcase';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';
import Hero from '@/editorialComponents/Hero/Hero';
import { Media } from '@/lib/types/media';
import { useTranslations } from 'next-intl';

export type SolutionsTemplateProps = {
  readonly hero: {
    readonly backgroundImage?: string;
    readonly altText?: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly solutions: readonly {
    readonly name: string;
    readonly description?: string;
    readonly slug: string;
    readonly tags?: { readonly label: string; readonly path?: string }[];
    readonly logo: Media;
  }[];
  readonly feature: {
    readonly title: string;
    readonly subtitle?: string;
    readonly items: FeatureItem[];
  };
  readonly successStories?: {
    readonly title: string;
    readonly subtitle?: string;
    readonly stories: {
      readonly title: string;
      readonly publishedAt?: Date;
      readonly path: string;
      readonly image?: {
        readonly url: string;
        readonly alternativeText?: string;
      };
    }[];
  };
};

const SolutionsTemplate = ({
  hero,
  solutions,
  feature,
  successStories,
}: SolutionsTemplateProps) => {
  const t = useTranslations('shared');
  const label = t('readStory');

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
            href: `/solutions/${solution.slug}`,
            logoUrl: solution.logo.url,
            tags: solution.tags,
          }))}
        />
      )}
      <Feature
        items={feature.items}
        title={feature.title}
        subtitle={feature.subtitle}
        useDarkTheme
      />
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
              text: label,
            },
          }))}
        />
      )}
    </>
  );
};

export default SolutionsTemplate;
