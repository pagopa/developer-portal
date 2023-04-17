import { Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import Link from 'next/link';
import * as React from 'react';
import { ProductGuideMenu, ProductGuidePage } from '@/domain/productGuidePage';
import { Menu } from '@/domain/navigator';

export type ProductGuidePageProps = ProductGuidePage & {
  navLinks: Menu;
} & { productGuideNav: ProductGuideMenu };

const ProductGuideNav = ({
  title,
  versionSlug,
  productGuideNav,
}: ProductGuidePageProps) => (
  <Stack spacing={2} bgcolor='background.default'>
    <Typography variant='h6'>{title}</Typography>
    <Typography color='text.secondary'>{versionSlug}</Typography>
    {pipe(
      productGuideNav,
      RA.map((menuItem) =>
        menuItem.kind === 'group' ? (
          <Typography
            key={menuItem.path}
            textAlign='center'
            color='text.disabled'
            textTransform='uppercase'
          >
            {menuItem.name}
          </Typography>
        ) : (
          <Typography
            key={menuItem.path}
            textAlign='center'
            component={Link}
            href={menuItem.path}
          >
            {menuItem.name}
          </Typography>
        )
      )
    )}
  </Stack>
);

export default ProductGuideNav;
