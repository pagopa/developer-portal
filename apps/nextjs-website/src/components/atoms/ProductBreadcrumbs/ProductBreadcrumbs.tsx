'use client';
import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  useTheme,
} from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import { BreadCrumbSegment } from '@/lib/types/path';

type ProductBreadcrumbsProps = {
  breadcrumbs: BreadCrumbSegment[];
};

const ProductBreadcrumbs = ({ breadcrumbs }: ProductBreadcrumbsProps) => {
  const theme = useTheme();
  const t = useTranslations('breadcrumbs');
  return (
    <EContainer>
      <Box
        component={'div'}
        sx={{ display: { xs: 'none', md: 'block' } }}
        my={2}
      >
        <Breadcrumbs sx={{ paddingTop: 2 }} aria-label='breadcrumb'>
          {breadcrumbs.map((breadcrumb, index) => {
            return index === breadcrumbs.length - 1 ? (
              <Typography key={index} fontSize={16} fontWeight={600}>
                {breadcrumb.translate ? t(breadcrumb.name) : breadcrumb.name}
              </Typography>
            ) : (
              <MuiLink
                key={index}
                component={Link}
                underline='hover'
                fontSize={16}
                color={
                  index === 0
                    ? theme.palette.text.primary
                    : theme.palette.text.disabled
                }
                href={breadcrumb.path}
              >
                {breadcrumb.translate ? t(breadcrumb.name) : breadcrumb.name}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      </Box>
    </EContainer>
  );
};

export default ProductBreadcrumbs;
