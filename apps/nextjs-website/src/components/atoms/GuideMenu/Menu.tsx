import React, { useMemo } from 'react';
import NextLink from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { RenderingComponents, renderMenu } from 'gitbook-docs/renderMenu';
import { parseMenu } from 'gitbook-docs/parseMenu';

import GuideVersionSelector, {
  type GuideVersionSelectorProps,
} from './GuideVersionSelector';
import { Typography } from '@mui/material';

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
    paddingTop: 6,
    paddingBottom: 6,
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

export type GuideMenuItemsProps = Partial<GuideVersionSelectorProps> & {
  name: string;
  assetsPrefix: string;
  currentPath?: string;
  expanded?: string[];
  menu: string;
  linkPrefix: string;
  containerRef?: React.RefObject<HTMLDivElement>;
};

const GuideMenuItems = ({
  assetsPrefix,
  currentPath,
  expanded = [],
  name,
  linkPrefix,
  menu,
  versionName,
  versions,
}: GuideMenuItemsProps) => {
  const components: RenderingComponents<React.ReactNode> = useMemo(
    () => ({
      Item: ({ href, title, children }) => {
        const label = (
          <Typography
            variant='sidenav'
            component={NextLink}
            href={href}
            color='text.secondary'
            style={{
              textDecoration: 'none',
              fontSize: '.938rem',
              fontWeight: 400,
            }}
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
            data-active={href === currentPath ? 'true' : 'false'}
          >
            {children}
          </StyledTreeItem>
        );
      },
      Title: ({ children }) => (
        <Typography
          color='text.primary'
          style={{
            paddingLeft: 32,
            paddingTop: 26,
            paddingBottom: 6,
            textDecoration: 'none',
            fontSize: '.875rem',
            fontWeight: 600,
          }}
          textTransform='uppercase'
        >
          {children}
        </Typography>
      ),
    }),
    [currentPath]
  );

  const children = useMemo(() => {
    const parsed = parseMenu(menu, { assetsPrefix, linkPrefix });
    return renderMenu(parsed, React, components);
  }, [menu, assetsPrefix, linkPrefix, components]);

  return (
    <>
      <Typography
        variant='h6'
        sx={{
          verticalAlign: 'middle',
          padding: { xs: '16px 24px', lg: '16px 32px' },
          fontSize: { xs: '20px', md: '24px' },
          fontWeight: { xs: 700, md: 600 },
        }}
      >
        {name}
      </Typography>
      {versions && versionName && (
        <GuideVersionSelector versions={versions} versionName={versionName} />
      )}
      <TreeView
        defaultCollapseIcon={<ExpandLessIcon />}
        defaultExpanded={expanded}
        selected={currentPath}
        defaultExpandIcon={<ExpandMoreIcon />}
      >
        {children}
      </TreeView>
    </>
  );
};

export default GuideMenuItems;
