import {
  Box,
  Breadcrumbs,
  Divider,
  Link as MuiLink,
  Typography,
  useTheme,
} from '@mui/material';
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
    <>
      <Box
        component={'div'}
        sx={{ display: { xs: 'none', md: 'block' } }}
        mx={15}
        mb={2}
        mt={4}
      >
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map((breadcrumb, index) => {
            return index === breadcrumbs.length - 1 ? (
              <Typography
                key={index}
                fontSize={16}
                lineHeight={24}
                fontWeight={600}
              >
                {breadcrumb.name}
              </Typography>
            ) : (
              <MuiLink
                key={index}
                component={Link}
                underline='hover'
                fontSize={16}
                lineHeight={24}
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
      <Divider />
    </>
  );
};

export default ProductBreadcrumbs;
