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

export type CaseHistoryPageTemplateProps = {
  slug: string;
  title: string;
  description?: string;
  products: Pick<Product, 'logo' | 'slug' | 'name' | 'description'>[];
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

  const ItemContainer = ({ children }: { children: React.ReactNode }) => (
    <Box paddingBottom={spacing(10)} paddingX={{ xs: '2rem', md: '20rem' }}>
      <Box maxWidth={1200}>{children}</Box>
    </Box>
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
      </ItemContainer>
      {parts.map((part: Part, index: number) =>
        part.component !== 'quote' ? (
          <ItemContainer key={index}>
            <PartRenderer part={part} />
          </ItemContainer>
        ) : (
          <Box
            key={index}
            sx={{
              marginBottom: 6,
            }}
          >
            <PartRenderer part={part} />
          </Box>
        )
      )}
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

export default CaseHistoryPageTemplate;
