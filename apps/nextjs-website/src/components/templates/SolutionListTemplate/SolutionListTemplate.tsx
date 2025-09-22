'use client';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import SolutionsShowcase from '@/components/organisms/SolutionsShowcase/SolutionsShowcase';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';
import Hero from '@/editorialComponents/Hero/Hero';
import { Media } from '@/lib/types/media';
import { SEO } from '@/lib/types/seo';
import { useTranslations } from 'next-intl';

export type SolutionListTemplateData = {
  readonly hero: {
    readonly backgroundImage?: string;
    readonly altText?: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly solutions: {
    readonly name: string;
    readonly description?: string;
    readonly slug: string;
    readonly tags?: { label: string; path?: string }[];
    readonly logo: Media;
  }[];
  readonly features?: {
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
  readonly seo?: SEO;
};

const SolutionListTemplate = ({
  hero,
  solutions,
  features,
  successStories,
}: SolutionListTemplateData) => {
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
