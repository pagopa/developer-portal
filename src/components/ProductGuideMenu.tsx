import {
  ProductGuideNav,
  getDirectChildrenOf,
} from '@/domain/productGuideNavigator';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { TreeItem, TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { isAncestor } from '@/domain/navigator';
import Box from '@mui/material/Box';

type ProductGuideMenuProps = {
  title: string;
  versions: string;
  guidePath: string;
  nav: ProductGuideNav;
  selected: string;
  expanded?: Array<string>;
};

const customStyle = {
  '& .MuiTreeItem-content': {
    flexDirection: 'row-reverse',
    pl: 1,
    py: 1,
  },
  '& .MuiTreeItem-label': {
    p: 0,
  },
  '& .MuiCollapse-root': {
    m: 0,
    pl: 2,
  },
  '& .Mui-selected > .MuiTreeItem-label > *': {
    color: "primary.dark"
  },
};

const renderItem = (
  item: ProductGuideNav[0],
  nav: ProductGuideNav
): JSX.Element => {
  const label =
    item.kind === 'page' ? (
      <Typography
        variant='sidenav'
        component={Link}
        href={item.path}
        style={{ textDecoration: 'none' }}
      >
        {item.name.nav}
      </Typography>
    ) : item.kind === 'group' ? (
      <Typography
        color='text.secondary'
        textTransform='uppercase'
        fontSize={14}
        style={{ textDecoration: 'none' }}
      >
        {item.name.nav}
      </Typography>
    ) : (
      <Typography
        variant='sidenav'
        component={Link}
        href={item.href}
        style={{ textDecoration: 'none' }}
      >
        {item.name.nav}
      </Typography>
    );
  return (
    <>
      <TreeItem
        key={item.path}
        nodeId={item.kind === 'link' ? item.href : item.path}
        label={label}
        disabled={item.kind === 'group'}
        icon={item.kind === 'link' ? <OpenInNewIcon /> : undefined}
        sx={customStyle}
      >
        {item.kind === 'page' &&
          getDirectChildrenOf(item.path, nav).map((child) =>
            renderItem(child, nav)
          )}
      </TreeItem>
      {item.kind === 'group' &&
        getDirectChildrenOf(item.path, nav).map((child) =>
          renderItem(child, nav)
        )}
    </>
  );
};

const ProductGuideMenu = ({
  title,
  versions,
  guidePath,
  nav,
  selected,
}: ProductGuideMenuProps) => (
  <Stack bgcolor='background.default' sx={{ px: 3, py: 10 }}>
    <Typography variant='h6'>{title}</Typography>
    <Box sx={{ py: 2 }}>
      <Typography color='text.secondary' variant='body2'>Versione {versions}</Typography>
    </Box>
    <TreeView
      defaultCollapseIcon={<ExpandLessIcon />}
      defaultExpanded={nav.filter(isAncestor(selected)).map(({ path }) => path)}
      selected={selected}
      defaultExpandIcon={<ExpandMoreIcon />}
    >
      {getDirectChildrenOf(guidePath, nav).map((item) => renderItem(item, nav))}
    </TreeView>
  </Stack>
);

export default ProductGuideMenu;
