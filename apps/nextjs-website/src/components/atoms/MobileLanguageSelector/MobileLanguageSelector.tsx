'use client';
import { Language } from '@mui/icons-material';
import { Box, Link as MuiLink, Typography, useTheme } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import { MobileSiteHeaderStyledTreeItem } from '@/components/molecules/MobileSiteHeader/MobileSiteHeader';
import { LanguageSelectorProps } from '../LanguageSelector/LanguageSelector';

const MobileLanguageSelector = ({
  locales,
  currentLocale,
}: LanguageSelectorProps) => {
  const { palette } = useTheme();

  const currentLocaleLabel =
    locales.find((locale) => locale.langCode === currentLocale)?.label ||
    currentLocale.toUpperCase();

  return (
    <>
      <MobileSiteHeaderStyledTreeItem
        disabled={locales.length <= 1}
        itemId={'siteHeader.languageMenu'}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Language
              sx={{
                width: 20,
                height: 20,
                color: palette.primary.dark,
                marginRight: 1,
              }}
            />
            <Typography
              variant='body2'
              noWrap
              sx={{
                maxWidth: '200px',
                color: palette.primary.dark,
                fontSize: 18,
                fontWeight: 600,
                display: 'block',
              }}
            >
              {currentLocaleLabel}
            </Typography>
          </Box>
        }
      >
        {locales.map(({ langCode, label }) => (
          <MuiLink
            key={langCode}
            variant='body1'
            component={Link}
            href={`/${langCode}`}
            style={{
              color: palette.primary.dark,
              display: 'block',
              textDecoration: 'none',
              marginBottom: 16,
            }}
          >
            {label}
          </MuiLink>
        ))}
      </MobileSiteHeaderStyledTreeItem>
    </>
  );
};

export default MobileLanguageSelector;
