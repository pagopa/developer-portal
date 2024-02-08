'use client';
import {
  SITE_HEADER_HEIGHT,
  SiteHeaderProps,
} from '@/components/molecules/SiteHeader/SiteHeader';
import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Divider, useTheme } from '@mui/material';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { TreeItem, treeItemClasses, TreeView } from '@mui/x-tree-view';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import MobileUserInfo from '@/components/atoms/MobileUserInfo/MobileUserInfo';
import { isProduction } from '@/config';

export const MobileSiteHeaderStyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`&`]: {
    '--x': 16,
    marginBottom: 16,
  },
  [`& .${treeItemClasses.content}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
    color: theme.palette.primary.dark,
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'start',
    gap: 0,
    padding: 0,
    margin: 0,
  },
  [`& .${treeItemClasses.content} .${treeItemClasses.focused}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.content}:hover`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.content}:has(.${treeItemClasses.iconContainer}:empty)`]:
    {
      paddingRight: 0,
    },
  [`& .${treeItemClasses.iconContainer}`]: {
    marginTop: 0,
    marginLeft: 8,
    marginRight: 0,
    marginBottom: 16,
    paddingRight: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.iconContainer}:empty`]: {
    display: 'none',
  },
  [`& .${treeItemClasses.content} > .${treeItemClasses.label}`]: {
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
  [`& .${treeItemClasses.content} > .${treeItemClasses.label} > a`]: {
    color: theme.palette.primary.dark,
    paddingTop: 16,
    paddingBottom: 16,
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
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  [`& .${treeItemClasses.group} a`]: {
    marginBottom: 16,
  },
  [`& .${treeItemClasses.group} .${treeItemClasses.label}`]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  [`& .${treeItemClasses.label}`]: {
    padding: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.root}`]: {
    margin: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.content} .${treeItemClasses.selected}`]: {
    backgroundColor: `${theme.palette.common.white} !important`,
  },
  [`& .${treeItemClasses.selected} > .${treeItemClasses.label} > *`]: {
    color: theme.palette.primary.dark,
  },
}));

const MobileSiteHeader = ({ products }: SiteHeaderProps) => {
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
        paddingLeft: 2,
        gap: 4,
        justifyContent: 'end',
      }}
    >
      <Button
        variant='naked'
        disableElevation
        onClick={handleClick}
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
        <TreeView
          aria-label='multi-select'
          defaultCollapseIcon={<ArrowDropUp />}
          defaultExpandIcon={<ArrowDropDown />}
          multiSelect
        >
          <MobileSiteHeaderStyledTreeItem
            nodeId={t('siteHeader.products')}
            label={t('siteHeader.products')}
            disabled={false}
          >
            {products.map((product, index) => {
              return (
                <Typography
                  key={index}
                  variant='body1'
                  component={NextLink}
                  href={product.subpaths.overview.path}
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
          {!isProduction && (
            <MobileSiteHeaderStyledTreeItem
              nodeId={'siteHeader.webinars'}
              label={t('siteHeader.webinars')}
            />
          )}
          <Divider sx={{ marginTop: -2, marginBottom: 2 }} />
          <MobileUserInfo />
        </TreeView>
      </Box>
    </Box>
  );
};

export default MobileSiteHeader;
