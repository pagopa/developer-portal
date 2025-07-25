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
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import { SEO } from '@/lib/types/seo';
import { isNonEmpty } from 'fp-ts/lib/Array';

export type SolutionTemplateProps = {
  slug: string;
  kickerTitle: string;
  title: string;
  description?: string;
  icon: Media;
  introductionToSteps?: string;
  steps: {
    title: string;
    content: BlocksContent;
    products: Pick<Product, 'shortName' | 'slug'>[];
  }[];
  statsSource?: string;
  dirName: string;
  landingUseCaseFile: string;
  stats: {
    title: string;
    description?: string;
  }[];
  products: Pick<Product, 'logo' | 'slug' | 'name' | 'description'>[];
  webinars: Webinar[];
  bannerLinks: BannerLinkProps[];
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
  solutionSlug: string;
  path?: string;
  seo?: SEO;
  updatedAt?: string;
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

  const solutionDetailPath = `/solutions/${slug}/details`;

  return (
    <>
      <EContainer>
        <Box sx={{ marginBottom: spacing(10) }}>
          <ProductBreadcrumbs
            breadcrumbs={[
              ...pageToBreadcrumbs('solutions', [
                {
                  name: title,
                  path: slug,
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
              href: `/${product.slug}/overview`,
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
