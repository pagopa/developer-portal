import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { Box, Link as LinkMui } from '@mui/material';
import Link from 'next/link';
import DesktopUserInfo from '@/components/atoms/DesktopUserInfo/DesktopUserInfo';
import React from 'react';
import { SiteHeaderProps } from '@/components/molecules/SiteHeader/SiteHeader';
import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/atoms/LanguageSelector/LanguageSelector';
import { SUPPORTED_LOCALES } from '@/locales';

const DesktopSiteHeader = ({
  currentLocale,
  products,
  isSolutionListPagePresent,
  isWebinarPagePresent,
}: SiteHeaderProps) => {
  const t = useTranslations('devPortal');

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
        items={products.map((product) => ({
          href: `/${currentLocale}/${product.slug}/overview`,
          label: product.name,
        }))}
        menuStyle={{
          sx: {
            marginTop: '17px',
          },
        }}
      />
      {isSolutionListPagePresent && (
        <LinkMui
          component={Link}
          color='primary.main'
          underline='none'
          href={`/${currentLocale}/solutions`}
          sx={{ fontSize: '16px', fontWeight: 600 }}
        >
          {t('siteHeader.solutions')}
        </LinkMui>
      )}
      {isWebinarPagePresent && (
        <LinkMui
          component={Link}
          color='primary.main'
          underline='none'
          href={`/${currentLocale}/webinars`}
          sx={{ fontSize: '16px', fontWeight: 600 }}
        >
          {t('siteHeader.webinars')}
        </LinkMui>
      )}
      <DesktopUserInfo locale={currentLocale} />
      <LanguageSelector
        locales={SUPPORTED_LOCALES}
        currentLocale={currentLocale}
      />
    </Box>
  );
};

export default DesktopSiteHeader;
