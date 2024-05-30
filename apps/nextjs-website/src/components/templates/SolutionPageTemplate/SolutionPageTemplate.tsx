'use client';
import React from 'react';
import { Product } from '@/lib/types/product';
import { useTranslations } from 'next-intl';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Webinar } from '@/lib/types/webinar';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';
import SolutionPreviewCard from '@/components/molecules/SolutionPreviewCard/SolutionsPreviewCard';
import BannerLinks from '@/components/molecules/BannerLinks/BannerLinks';
import FutureWebinarsShowcase from '@/components/organisms/FutureWebinarsShowcase/FutureWebinarsShowcase';

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
      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        spacing={5}
        paddingY={10}
        paddingX={50}
      >
        {stats.map((stat, index) => (
          <Box
            flexDirection={'column'}
            textAlign={'center'}
            key={index}
            gap={10}
            maxWidth={150}
          >
            <Typography
              fontWeight={700}
              color={palette.primary.main}
              variant='h2'
            >
              {stat.title}
            </Typography>
            {stat.description && (
              <Typography
                component={'p'}
                color={palette.text.primary}
                variant='body1'
              >
                {stat.description}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
      {/* // TODO: need mock auth provider to add this*/}
      {/* {webinars.length > 0 && <FutureWebinarsShowcase webinars={webinars} />} */}
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
