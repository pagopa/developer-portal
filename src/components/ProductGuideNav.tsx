import { Box, Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import Link from 'next/link';
import * as React from 'react';
import { ProductGuideMenu, ProductGuidePage } from '@/domain/productGuidePage';
import { Menu } from '@/domain/navigator';
import { useRouter } from 'next/router';

export type ProductGuidePageProps = ProductGuidePage & {
  navLinks: Menu;
} & { productGuideNav: ProductGuideMenu };

const ProductGuideNav = ({
  title,
  versionSlug,
  productGuideNav,
}: ProductGuidePageProps) => {
  const currentPath = useRouter().asPath;
  return (
    <Stack spacing={2} bgcolor='background.default' maxWidth='354'>
      {/* From Figma bgcolor should be #FAFAFA, but it doesn't exist on MUI-Italia */}
      <Box sx={{ p: 1 }}>
        <Typography variant='h6'>{title}</Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography color='text.secondary'>{versionSlug}</Typography>
      </Box>
      {pipe(
        productGuideNav,
        // If the menuItem is a group, render it without the link reference;
        RA.map((menuItem) =>
          menuItem.kind === 'group' ? (
            <Box key={menuItem.name} component='span' sx={{ p: 1 }}>
              <Typography
                key={menuItem.name}
                color='text.disabled'
                textTransform='uppercase'
              >
                {menuItem.name}
              </Typography>
            </Box>
          ) : currentPath.includes(menuItem.path) ? (
            // This is the current page, so we render it in a different color
            // TODO: Missing opacity here
            <Box key={menuItem.name} component='span' sx={{ p: 1 }}>
              <Typography
                variant='sidenav'
                color='primary.main'
                key={menuItem.name}
                component={Link}
                href={menuItem.path}
                sx={{ textDecoration: 'none' }}
              >
                {menuItem.name}
              </Typography>
            </Box>
          ) : (
            // This is a link to another page (not the current one)
            <Box key={menuItem.name} component='span' sx={{ p: 1 }}>
              <Typography
                variant='sidenav'
                key={menuItem.name}
                component={Link}
                href={menuItem.path}
                sx={{ textDecoration: 'none' }}
              >
                {menuItem.name}
              </Typography>
            </Box>
          )
        )
      )}
    </Stack>
  );
};

export default ProductGuideNav;
