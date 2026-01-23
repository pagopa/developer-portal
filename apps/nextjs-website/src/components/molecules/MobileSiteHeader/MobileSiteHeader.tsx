'use client';
import { SiteHeaderProps } from '@/components/molecules/SiteHeader/SiteHeader';
import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Divider, useTheme } from '@mui/material';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import MobileUserInfo from '@/components/atoms/MobileUserInfo/MobileUserInfo';
import { SITE_HEADER_HEIGHT } from '@/config';
import MobileLanguageSelector from '@/components/atoms/MobileLanguageSelector/MobileLanguageSelector';
import { SUPPORTED_LOCALES } from '@/locales';

export const MobileSiteHeaderStyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`&`]: {
    '--x': 16,
    marginBottom: 16,
  },
  [`& .MuiTreeItem-content`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
    color: theme.palette.primary.dark,
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'start',
    gap: 0,
    padding: 0,
    margin: 0,
  },
  [`& .MuiTreeItem-content .Mui-focused`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .MuiTreeItem-content:hover`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .MuiTreeItem-content:has(.MuiTreeItem-iconContainer:empty)`]: {
    paddingRight: 0,
  },
  [`& .MuiTreeItem-iconContainer`]: {
    marginTop: 0,
    marginLeft: 8,
    marginRight: 0,
    marginBottom: 16,
    paddingRight: 0,
    paddingLeft: 0,
  },
  [`& .MuiTreeItem-iconContainer:empty`]: {
    display: 'none',
  },
  [`& .MuiTreeItem-content > .MuiTreeItem-label`]: {
    color: theme.palette.primary.dark,
    fontSize: 18,
    fontWeight: 600,
    width: 'fit-content',
    lineHeight: '22px',
    display: 'flex',
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 16,
    padding: 0,
  },
  [`& .MuiTreeItem-content > .MuiTreeItem-label > a`]: {
    color: theme.palette.primary.dark,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 32,
  },
  [`& ul`]: {
    paddingLeft: 0,
    '--y': 'calc(var(--x) + 0)',
  },
  [`& li`]: {
    '--x': 'calc(var(--y) + 24)',
  },
  ['& a']: {
    paddingLeft: 'calc(1px * var(--x))',
  },
  [`& .MuiTreeItem-group`]: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 8,
  },
  [`& .MuiTreeItem-group a`]: {
    marginBottom: 16,
  },
  [`& .MuiCollapse-wrapperInner a`]: {
    marginBottom: 4,
    paddingTop: 4,
    paddingBottom: 4,
  },
  [`& .MuiTreeItem-group .MuiTreeItem-label`]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  [`& .MuiTreeItem-label`]: {
    padding: 0,
    paddingLeft: 0,
  },
  [`& .MuiTreeItem-root`]: {
    margin: 0,
    paddingLeft: 0,
  },
  [`& .Mui-selected`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .MuiTreeItem-content .Mui-selected`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .Mui-selected > .MuiTreeItem-label > *`]: {
    color: theme.palette.primary.dark,
  },
}));

const MobileSiteHeader = ({ currentLocale, products }: SiteHeaderProps) => {
  const t = useTranslations('devPortal');
  const { palette } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        menuRef.current &&
        isOpen &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(!isOpen);
        event.stopPropagation();
      }
    };
    document.body.addEventListener('click', closeMenu);

    return () => {
      document.body.removeEventListener('click', closeMenu);
    };
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        direction: 'row',
        display: { xs: 'flex', sm: 'none' },
        flexGrow: 1,
        width: '100%',
        paddingRight: 2,
        gap: 2,
        justifyContent: 'flex-end',
      }}
    >
      <Button
        variant='text'
        disableElevation
        onClick={handleClick}
        sx={{ marginLeft: 'auto', marginRight: '-30px' }}
        endIcon={isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {t('siteHeader.label')}
      </Button>
      <Box
        ref={menuRef}
        sx={{
          display: isOpen ? 'block' : 'none',
          backgroundColor: 'white',
          top: SITE_HEADER_HEIGHT,
          left: 0,
          padding: '16px 44px 8px 44px',
          position: 'fixed',
          width: '100%',
          zIndex: 200,
        }}
      >
        <SimpleTreeView
          aria-label='multi-select'
          slots={{
            collapseIcon: ArrowDropUp,
            expandIcon: ArrowDropDown,
          }}
          multiSelect
        >
          <MobileSiteHeaderStyledTreeItem
            itemId={t('siteHeader.products')}
            label={t('siteHeader.products')}
            disabled={false}
          >
            {products.map((product, index) => {
              return (
                <Typography
                  key={index}
                  variant='body1'
                  component={NextLink}
                  href={`/${currentLocale}/${product.slug}/overview`}
                  onClick={handleClick}
                  style={{
                    color: palette.primary.dark,
                    display: 'block',
                    textDecoration: 'none',
                  }}
                >
                  {product.name}
                </Typography>
              );
            })}
          </MobileSiteHeaderStyledTreeItem>

          <MobileSiteHeaderStyledTreeItem
            itemId={'siteHeader.solutions'}
            label={
              <Typography
                component={NextLink}
                variant='body1'
                href={`/${currentLocale}/solutions`}
                onClick={handleClick}
                style={{
                  color: palette.primary.dark,
                  display: 'block',
                  textDecoration: 'none',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                {t('siteHeader.solutions')}
              </Typography>
            }
          />
          <MobileSiteHeaderStyledTreeItem
            itemId={'siteHeader.webinars'}
            label={
              <Typography
                component={NextLink}
                variant='body1'
                href={`/${currentLocale}/webinars`}
                onClick={handleClick}
                style={{
                  color: palette.primary.dark,
                  display: 'block',
                  textDecoration: 'none',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                {t('siteHeader.webinars')}
              </Typography>
            }
          />

          <Divider sx={{ marginTop: -2, marginBottom: 2 }} />
          <MobileUserInfo onClick={handleClick} />
          <Divider sx={{ marginTop: -2, marginBottom: 2 }} />
          <MobileLanguageSelector
            locales={SUPPORTED_LOCALES}
            currentLocale={currentLocale}
          />
        </SimpleTreeView>
      </Box>
    </Box>
  );
};

export default MobileSiteHeader;
