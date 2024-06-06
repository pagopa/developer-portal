'use client';
import React from 'react';
import { Product } from '@/lib/types/product';
import { useTranslations } from 'next-intl';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, Stack, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';
import SolutionPreviewCard from '@/components/molecules/SolutionPreviewCard/SolutionsPreviewCard';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import FutureWebinarsShowcase from '@/components/organisms/FutureWebinarsShowcase/FutureWebinarsShowcase';
import Stats from '@/components/atoms/Stats/Stats';

export type SolutionPageTemplateProps = {
  slug: string;
  kickerTitle: string;
  title: string;
  description?: string;
  steps: {
    title: string;
    // content: BlocksContent; TODO: uncomment when blocks are ready
    content: string;
    products: Product[];
  }[];
  dirName: string;
  landingUseCaseFile: string;
  stats: {
    title: string;
    description?: string;
  }[];
  products: Product[];
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

  const ItemContainer = ({ children }: { children: React.ReactNode }) => (
    <Stack
      flexDirection={'row'}
      justifyContent={'center'}
      marginBottom={spacing(5)}
    >
      <Box maxWidth={1200}>{children}</Box>
    </Stack>
  );

  return (
    <>
      <ItemContainer>
        <Box sx={{ marginTop: 10, paddingTop: 3, paddingBottom: spacing(10) }}>
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
      </ItemContainer>
      <ItemContainer>
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
      </ItemContainer>
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
      <ItemContainer>
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
      </ItemContainer>
    </>
  );
};

export default SolutionPageTemplate;
