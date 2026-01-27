import React, { useMemo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import { styled } from '@mui/material/styles';
import { RenderingComponents, renderMenu } from 'gitbook-docs/renderMenu';
import { parseMenu } from 'gitbook-docs/parseMenu';

import GuideVersionSelector, {
  type GuideVersionSelectorProps,
} from './GuideVersionSelector';
import { Typography } from '@mui/material';
import { GitBookContentData } from '../../../lib/types/gitBookContent';

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`&`]: {
    '--x': 32,
  },
  [`& .MuiTreeItem-content`]: {
    boxSizing: 'border-box',
    flexDirection: 'row-reverse',
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 32,
    alignItems: 'space-between',
  },
  [`& .MuiTreeItem-content:has(.MuiTreeItem-iconContainer:empty)`]: {
    paddingRight: 0,
  },
  [`& .MuiTreeItem-iconContainer`]: {
    justifyContent: 'flex-end',
    marginRight: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },
  [`& .MuiTreeItem-iconContainer:empty`]: {
    display: 'none',
  },
  [`& .MuiTreeItem-content > .MuiTreeItem-label`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
  },
  [`& .MuiTreeItem-content > .MuiTreeItem-label > a`]: {
    paddingTop: 6,
    paddingBottom: 6,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 10,
      paddingBottom: 10,
    },
    paddingRight: 32,
  },
  [`& ul`]: {
    paddingLeft: 0,
    '--y': 'calc(var(--x) + 0)',
  },
  [`& li`]: {
    '--x': 'calc(var(--y) + 12)',
  },
  ['& a']: {
    paddingLeft: 'calc(1px * var(--x))',
  },
  [`& .MuiTreeItem-group`]: {
    marginLeft: 0,
    marginRight: 0,
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
    borderRight: `2px solid ${theme.palette.primary.dark}`,
  },
  [`& .MuiTreeItem-content.Mui-selected`]: {
    backgroundColor: theme.palette.primaryAction.selected,
  },
  [`& .MuiTreeItem-content.Mui-selected:hover`]: {
    backgroundColor: theme.palette.primaryAction.selected,
  },
  [`& .Mui-selected > .MuiTreeItem-label > *`]: {
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
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onGuideNavigate?: (payload: GitBookContentData) => boolean;
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
  onGuideNavigate,
}: GuideMenuItemsProps) => {
  const components: RenderingComponents<React.ReactNode> = useMemo(
    () => ({
      Item: ({ href, title, children }) => {
        const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
          if (href.startsWith('http')) return; // external
          e.preventDefault();
          const cleanHref = href.split('#')[0];
          const parts = cleanHref.split('/').filter(Boolean);
          const apiPath = `/api/${parts.join('/')}`;
          fetch(apiPath, { headers: { Accept: 'application/json' } })
            .then((res) => (res.ok ? res.json() : undefined))
            .then((data) => {
              if (data && onGuideNavigate) {
                onGuideNavigate(data);
              }
            })
            .catch(() => undefined);
        };
        const label = (
          <Typography
            variant='sidenav'
            component='a'
            href={href}
            onClick={handleNavigate}
            color='text.secondary'
            sx={{
              textDecoration: 'none',
              fontSize: { xs: '1rem', md: '.938rem' },
              fontWeight: 400,
            }}
          >
            {title}
          </Typography>
        );

        return (
          <StyledTreeItem
            key={href}
            itemId={href}
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
    [currentPath, onGuideNavigate]
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
      <SimpleTreeView
        slots={{
          collapseIcon: ExpandLessIcon,
          expandIcon: ExpandMoreIcon,
        }}
        defaultExpandedItems={expanded}
        selectedItems={currentPath}
      >
        {children}
      </SimpleTreeView>
    </>
  );
};

export default GuideMenuItems;
