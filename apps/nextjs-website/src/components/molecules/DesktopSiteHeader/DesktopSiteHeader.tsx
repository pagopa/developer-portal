import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { Box, Link as LinkMui } from '@mui/material';
import Link from 'next/link';
import DesktopUserInfo from '@/components/atoms/DesktopUserInfo/DesktopUserInfo';
import React, { useMemo } from 'react';
import { SiteHeaderProps } from '@/components/molecules/SiteHeader/SiteHeader';
import { useTranslations } from 'next-intl';
import { Product } from '@/lib/types/product';

const DesktopSiteHeader = ({ products }: SiteHeaderProps) => {
  const t = useTranslations('devPortal');

  // Filter out products that don't have an overview page
  const filteredProducts = useMemo(
    () => products.filter((product: Product) => product.overview?.data),
    [products]
  );

  return (
    <Box
      sx={{
        alignItems: 'center',
        direction: 'row',
        display: { xs: 'none', sm: 'flex' },
        flexGrow: 1,
        gap: 4,
        justifyContent: 'space-between',
      }}
    >
      <Dropdown
        label={t('siteHeader.products')}
        items={filteredProducts.map((product) => ({
          href: `${product.slug}/overview`,
          label: product.name,
        }))}
      />
      <LinkMui
        component={Link}
        color='primary.main'
        underline='none'
        href={'/solutions'}
        sx={{ fontSize: '16px', fontWeight: 600 }}
      >
        {t('siteHeader.solutions')}
      </LinkMui>
      <LinkMui
        component={Link}
        color='primary.main'
        underline='none'
        href={'/webinars'}
        sx={{ fontSize: '16px', fontWeight: 600 }}
      >
        {t('siteHeader.webinars')}
      </LinkMui>
      <DesktopUserInfo />
    </Box>
  );
};

export default DesktopSiteHeader;
