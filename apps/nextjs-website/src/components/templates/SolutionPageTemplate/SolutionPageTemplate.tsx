'use client';
import React from 'react';
import { Product } from '@/lib/types/product';
import { useTranslations } from 'next-intl';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';
import SolutionPreviewCard from '@/components/molecules/SolutionPreviewCard/SolutionsPreviewCard';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import FutureWebinarsShowcase from '@/components/organisms/FutureWebinarsShowcase/FutureWebinarsShowcase';
import Stats from '@/components/atoms/Stats/Stats';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from '@/lib/types/media';

export type SolutionPageTemplateProps = {
  slug: string;
  kickerTitle: string;
  title: string;
  description?: string;
  icon: Media;
  steps: {
    title: string;
    content: BlocksContent;
    products: Pick<Product, 'name' | 'slug'>[];
  }[];
  dirName: string;
  landingUseCaseFile: string;
  stats: {
    title: string;
    description?: string;
  }[];
  products: Pick<Product, 'logo' | 'slug' | 'name' | 'description'>[];
  webinars: Webinar[];
  bannerLinks: BannerLinkProps[];
};

const SolutionPageTemplate = ({
  slug,
  kickerTitle,
  title,
  description,
  steps,
  dirName,
  landingUseCaseFile,
  stats,
  products,
  webinars,
  bannerLinks,
}: SolutionPageTemplateProps) => {
  const { palette, spacing } = useTheme();
  const t = useTranslations();

  const solutionDetailPath = `/${dirName}/${slug}/${landingUseCaseFile}/detail`; // TODO: check if this is correct

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
          description={description || ''}
          cta={{
            label: t('solution.ctaDetailLabel'),
            href: solutionDetailPath,
          }}
          steps={steps.map((step) => ({
            title: step.title,
            content: step.content,
            products: step.products.map((product) => ({
              label: product.name,
              href: `/${product.slug}/overview`,
            })),
          }))}
        />
      </EContainer>
      {bannerLinks && <BannerLinks banners={bannerLinks} />}
      {stats && (
        <Stats
          maxWidth={200}
          items={stats.map((stat) => ({
            title: stat.title,
            description: stat.description,
          }))}
        />
      )}
      {webinars.length > 0 && <FutureWebinarsShowcase webinars={webinars} />}
      <ProductsShowcase
        cardSize={{ xs: 12, md: 4 }}
        backgroundColor={palette.background.paper}
        title={t('caseHistory.productShowcaseLabel')}
        cards={products.map((product) => ({
          title: product.name,
          text: product.description || '',
          href: `/${product.slug}/overview`,
          logoUrl: product.logo.url,
        }))}
      />
    </>
  );
};

export default SolutionPageTemplate;
