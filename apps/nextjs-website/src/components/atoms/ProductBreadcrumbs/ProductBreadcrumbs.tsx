'use client';
import {
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';
import { BreadcrumbSegment } from '@/lib/types/path';

type ProductBreadcrumbsProps = {
  breadcrumbs: BreadcrumbSegment[];
};

const ProductBreadcrumbs = ({ breadcrumbs }: ProductBreadcrumbsProps) => {
  const theme = useTheme();
  const t = useTranslations();
  return (
    <Box
      component='div'
      sx={{
        display: { xs: 'none', md: 'block' },
        paddingY: '24px',
        zIndex: 50,
        position: 'relative',
      }}
    >
      <Breadcrumbs aria-label='breadcrumb'>
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
  );
};

export default ProductBreadcrumbs;
