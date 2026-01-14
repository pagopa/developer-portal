'use client';
import React from 'react';
import { Product } from '@/lib/types/product';
import { useTranslations } from 'next-intl';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import SolutionPreviewCard from '@/components/molecules/SolutionPreviewCard/SolutionsPreviewCard';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import FutureWebinarsShowcase from '@/components/organisms/FutureWebinarsShowcase/FutureWebinarsShowcase';
import Stats from '@/components/atoms/Stats/Stats';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from '@/lib/types/media';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import { SEO } from '@/lib/types/seo';
import { isNonEmpty } from 'fp-ts/lib/Array';
import { useParams } from 'next/navigation';

export type SolutionTemplateProps = {
  readonly slug: string;
  readonly kickerTitle: string;
  readonly title: string;
  readonly description?: string;
  readonly icon: Media;
  readonly introductionToSteps?: string;
  readonly steps: {
    readonly title: string;
    readonly content: BlocksContent;
    readonly products: Pick<Product, 'shortName' | 'slug'>[];
  }[];
  readonly statsSource?: string;
  readonly dirName: string;
  readonly landingUseCaseFile: string;
  readonly stats: {
    readonly title: string;
    readonly description?: string;
  }[];
  readonly products: Pick<Product, 'logo' | 'slug' | 'name' | 'description'>[];
  readonly webinars: Webinar[];
  readonly bannerLinks: BannerLinkProps[];
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
  readonly solutionSlug: string;
  readonly path?: string;
  readonly seo?: SEO;
  readonly updatedAt?: string;
};

const SolutionTemplate = ({
  slug,
  kickerTitle,
  title,
  description,
  introductionToSteps,
  steps,
  stats,
  statsSource,
  products,
  webinars,
  bannerLinks,
  successStories,
}: SolutionTemplateProps) => {
  const { palette, spacing } = useTheme();
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();

  const solutionDetailPath = `/solutions/${slug}/details`;

  return (
    <>
      <EContainer>
        <Box sx={{ marginBottom: spacing(10) }}>
          <ProductBreadcrumbs
            breadcrumbs={[
              ...pageToBreadcrumbs(locale, 'solutions', [
                {
                  name: title,
                  path: `/${locale}/solutions/${slug}`,
                },
              ]),
            ]}
          />
        </Box>
      </EContainer>
      <EContainer sx={{ marginBottom: spacing(10) }}>
        <SolutionPreviewCard
          header={kickerTitle}
          title={title}
          description={introductionToSteps || description || ''}
          cta={{
            label: t('solution.ctaDetailLabel'),
            href: solutionDetailPath,
          }}
          steps={steps.map((step) => ({
            title: step.title,
            content: step.content,
            products: step.products.map((product) => ({
              label: product.shortName,
              href: `/${locale}/${product.slug}/overview`,
            })),
          }))}
        />
      </EContainer>
      {bannerLinks && <BannerLinks bannerLinks={bannerLinks} />}
      {isNonEmpty(stats) && (
        <Stats
          maxWidth={265}
          items={stats.map((stat) => ({
            title: stat.title,
            description: stat.description,
          }))}
          statsSource={statsSource}
        />
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
      {isNonEmpty(webinars) && (
        <FutureWebinarsShowcase
          webinars={webinars}
          title='dedicatedWebinar'
          description='solutionDescription'
        />
      )}
      {isNonEmpty(products) && (
        <ProductsShowcase
          cardSize={{ xs: 12, md: 4 }}
          backgroundColor={palette.background.paper}
          title={t('caseHistory.productShowcaseLabel')}
          cards={products.map((product) => ({
            title: product.name,
            text: product.description || '',
            href: `/${product.slug}/overview`,
            logoUrl: product.logo?.url || '',
          }))}
        />
      )}
    </>
  );
};

export default SolutionTemplate;
