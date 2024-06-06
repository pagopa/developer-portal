'use client';
import React from 'react';
import { Product } from '@/lib/types/product';
import { Part } from '@/lib/types/part';
import PartRenderer from '@/components/molecules/PartRenderer/PartRenderer';
import { useTranslations } from 'next-intl';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { pageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { Box, Typography, useTheme } from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export type CaseHistoryPageTemplateProps = {
  slug: string;
  title: string;
  description?: string;
  products: Product[];
  parts: Part[];
};

const CaseHistoryPageTemplate = ({
  slug,
  title,
  description,
  products,
  parts,
}: CaseHistoryPageTemplateProps) => {
  const { palette, spacing } = useTheme();
  const t = useTranslations();

  return (
    <>
      <EContainer>
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
        <Box sx={{ paddingBottom: spacing(10) }}>
          <Typography color={'text.primary'} variant='h4'>
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
          <Box
            key={index}
            sx={{
              marginY: 3,
            }}
          >
            <PartRenderer part={part} />
          </Box>
        )
      )}
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

export default CaseHistoryPageTemplate;
