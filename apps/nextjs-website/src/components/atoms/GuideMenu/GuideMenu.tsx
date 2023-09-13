'use client';
import React, { ReactNode } from 'react';
import NextLink from 'next/link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from 'next/router';
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { parseMenu } from 'gitbook-docs/parseMenu';
import { RenderingComponents, renderMenu } from 'gitbook-docs/renderMenu';

type GuideMenuProps = {
  linkPrefix: string;
  assetsPrefix: string;
  menu: string;
};

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    boxSizing: 'border-box',
    flexDirection: 'row-reverse',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
  },
  [`& .${treeItemClasses.content} > .${treeItemClasses.label}`]: {
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
  },
  [`& .${treeItemClasses.group} .${treeItemClasses.label}`]: {
    paddingLeft: 48,
    paddingRight: 24,
  },
  [`& .${treeItemClasses.group} .${treeItemClasses.group} .${treeItemClasses.label}`]:
    {
      paddingLeft: 80,
    },
  [`& .${treeItemClasses.label}`]: {
    padding: 0,
    paddingLeft: 16,
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

const GuideMenu = ({ menu, assetsPrefix, linkPrefix }: GuideMenuProps) => {
  const currentPath = useRouter().asPath;
  const segments = currentPath.split('/');
  const expanded = segments.map((_, i) => segments.slice(0, i + 1).join('/'));
  return (
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
  );
};

export default GuideMenu;
