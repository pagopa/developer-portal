'use client';
import React from 'react';
import { Product } from '@/lib/types/product';
import { Part } from '@/lib/types/part';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import { useTranslations } from 'next-intl';
import ProductsShowcase, {
  ProductsShowcaseProps,
} from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, Typography, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { SEO } from '@/lib/types/seo';

export type CaseHistoryPageTemplateProps = {
  slug: string;
  title: string;
  image?: Media;
  updatedAt: string;
  description?: string;
  products: Pick<Product, 'logo' | 'slug' | 'name' | 'description'>[];
  parts: Part[];
  seo?: SEO;
};

const CaseHistoryPageTemplate = ({
  slug,
  title,
  description,
  products,
  parts,
}: CaseHistoryPageTemplateProps) => {
  const { palette } = useTheme();
  const t = useTranslations();

  const cards = products
    .map((product) => {
      if (!product.description || !product.logo) {
        return null;
      }
      return {
        title: product.name,
        text: product.description,
        href: `/${product.slug}/overview`,
        logoUrl: product.logo?.url,
      };
    })
    .filter(Boolean) as ProductsShowcaseProps['cards'];

  return (
    <>
      <EContainer direction={'column'} sx={{ marginBottom: 12 }}>
        <Box sx={{ marginBottom: 10 }}>
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
        <Box>
          <Typography color={'text.primary'} variant='h4' marginBottom={2}>
            {title}
          </Typography>
          {description && (
            <Typography
              component={typeof description === 'string' ? 'p' : 'div'}
              color={'text.primary'}
              variant='body1'
            >
              {description}
            </Typography>
          )}
        </Box>
      </EContainer>
      {parts.map((part: Part, index: number) =>
        part.component !== 'quote' ? (
          <EContainer key={index}>
            <PartRenderer part={part} />
          </EContainer>
        ) : (
          <Box key={index}>
            <PartRenderer part={part} />
          </Box>
        )
      )}
      {cards.length > 0 && (
        <ProductsShowcase
          verticalPadding={10}
          cardSize={{ xs: 12, md: 4 }}
          backgroundColor={palette.background.paper}
          title={t('caseHistory.productShowcaseLabel')}
          cards={cards}
        />
      )}
    </>
  );
};

export default CaseHistoryPageTemplate;
