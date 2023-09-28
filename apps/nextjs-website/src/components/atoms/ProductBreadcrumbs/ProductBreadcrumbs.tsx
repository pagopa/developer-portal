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

type ProductBreadcrumbsProps = {
  breadcrumbs: {
    name: string;
    path: string;
  }[];
};

const ProductBreadcrumbs = ({ breadcrumbs }: ProductBreadcrumbsProps) => {
  const theme = useTheme();
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
                {breadcrumb.name}
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
                {breadcrumb.name}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      </Box>
    </EContainer>
  );
};

export default ProductBreadcrumbs;
