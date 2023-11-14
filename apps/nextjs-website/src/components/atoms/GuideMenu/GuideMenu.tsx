'use client';
import React, { ReactNode } from 'react';
import NextLink from 'next/link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { usePathname } from 'next/navigation';
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { parseMenu } from 'gitbook-docs/parseMenu';
import { RenderingComponents, renderMenu } from 'gitbook-docs/renderMenu';
import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { translations } from '@/_contents/translations';
import { useScrollUp } from '../ProductHeader/useScrollUp';
import { SITE_HEADER_HEIGHT } from '@/components/molecules/SiteHeader/SiteHeader';

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
  guideName: string;
  versionName: string;
  versions: { name: string; path: string }[];
};

export const PRODUCT_HEADER_HEIGHT = 80;

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`&`]: {
    '--x': 32,
  },
  [`& .${treeItemClasses.content}`]: {
    boxSizing: 'border-box',
    flexDirection: 'row-reverse',
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 32,
    alignItems: 'space-between',
  },
  [`& .${treeItemClasses.content}:has(.${treeItemClasses.iconContainer}:empty)`]:
    {
      paddingRight: 0,
    },
  [`& .${treeItemClasses.iconContainer}`]: {
    justifyContent: 'flex-end',
    marginRight: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.iconContainer}:empty`]: {
    display: 'none',
  },
  [`& .${treeItemClasses.content} > .${treeItemClasses.label}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
  },
  [`& .${treeItemClasses.content} > .${treeItemClasses.label} > a`]: {
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
    borderRight: `2px solid ${theme.palette.primary.dark}`,
  },
  [`& .${treeItemClasses.selected} > .${treeItemClasses.label} > *`]: {
    color: theme.palette.primary.dark,
  },
}));

const components: RenderingComponents<ReactNode> = {
  Item: ({ href, title, children }) => {
    const label = (
      <Typography
        variant='sidenav'
        component={NextLink}
        href={href}
        style={{ textDecoration: 'none' }}
      >
        {title}
      </Typography>
    );

    return (
      <StyledTreeItem
        key={href}
        nodeId={href}
        label={label}
        disabled={false}
        icon={href.startsWith('http') ? <OpenInNewIcon /> : undefined}
      >
        {children}
      </StyledTreeItem>
    );
  },
  Title: ({ children }) => (
    <Typography
      color='text.secondary'
      style={{
        paddingLeft: 32,
        paddingTop: 24,
        paddingBottom: 0,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 700,
      }}
      textTransform='uppercase'
    >
      {children}
    </Typography>
  ),
};

const GuideMenu = ({
  menu,
  assetsPrefix,
  linkPrefix,
  guideName,
  versionName,
  versions,
}: GuideMenuProps) => {
  const { palette } = useTheme();
  const { shared } = translations;
  const scrollUp = useScrollUp();
  const currentPath = usePathname();
  const segments = currentPath.split('/');
  const expanded = segments.map((_, i) => segments.slice(0, i + 1).join('/'));
  const top = scrollUp
    ? SITE_HEADER_HEIGHT + PRODUCT_HEADER_HEIGHT
    : PRODUCT_HEADER_HEIGHT;
  return (
    <Box
      sx={{
        backgroundColor: palette.grey[50],
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: { lg: 'sticky' },
        top: { lg: top },
        height: { lg: `calc(100vh - ${top}px)` },
        overflowY: 'auto',
        transition: 'all 0.5s linear',
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 0',
          width: { lg: '347px' },
          flexGrow: { lg: 0 },
          flexShrink: { lg: 0 },
        }}
      >
        <Typography
          variant='h6'
          sx={{
            padding: '16px 32px',
            verticalAlign: 'middle',
          }}
        >
          {guideName}
        </Typography>
        <Dropdown
          label={`${shared.version} ${versionName}`}
          items={versions.map((version) => ({
            href: version.path,
            label: version.name,
          }))}
          icons={{ opened: <ExpandLess />, closed: <ExpandMore /> }}
          buttonStyle={{
            color: palette.action.active,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px 32px',
          }}
          menuStyle={{
            style: {
              width: '347px',
              maxWidth: '347px',
              left: 0,
              right: 0,
            },
          }}
          menuAnchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        />
        <TreeView
          defaultCollapseIcon={<ExpandLessIcon />}
          defaultExpanded={expanded}
          selected={currentPath}
          defaultExpandIcon={<ExpandMoreIcon />}
        >
          {renderMenu(
            parseMenu(menu, { assetsPrefix, linkPrefix }),
            React,
            components
          )}
        </TreeView>
      </Box>
    </Box>
  );
};

export default GuideMenu;
