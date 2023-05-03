import { ProductGuideNav, isChild } from '@/domain/productGuideNavigator';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Menu, isAncestor } from '@/domain/navigator';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ProductGuideVersionsMenu from './ProductGuideVersionsMenu';

type ProductGuideMenuProps = {
  title: string;
  versionsMenu: Menu;
  guidePath: string;
  nav: ProductGuideNav;
  selected: string;
  expanded?: Array<string>;
};

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    flexDirection: 'row-reverse',
    padding: 8,
  },
  [`& .${treeItemClasses.label}`]: {
    padding: 0,
  },
  [`& .${treeItemClasses.root}`]: {
    margin: 0,
    paddingLeft: 2,
  },
  [`& .${treeItemClasses.selected} > .${treeItemClasses.label} > *`]: {
    color: theme.palette.primary.dark,
  },
}));

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
      <StyledTreeItem
        key={item.path}
        nodeId={item.kind === 'link' ? item.href : item.path}
        label={label}
        disabled={item.kind === 'group'}
        icon={item.kind === 'link' ? <OpenInNewIcon /> : undefined}
      >
        {item.kind === 'page' &&
          nav.filter(isChild(item.path)).map((child) => renderItem(child, nav))}
      </StyledTreeItem>
      {item.kind === 'group' &&
        nav.filter(isChild(item.path)).map((child) => renderItem(child, nav))}
    </>
  );
};

const ProductGuideMenu = ({
  title,
  versionsMenu,
  guidePath,
  nav,
  selected,
}: ProductGuideMenuProps) => (
  <Stack bgcolor='background.default' sx={{ px: 3, py: 10 }}>
    <Typography variant='h6'>{title}</Typography>
    <ProductGuideVersionsMenu versionsMenu={versionsMenu} />
    <TreeView
      defaultCollapseIcon={<ExpandLessIcon />}
      defaultExpanded={nav.filter(isAncestor(selected)).map(({ path }) => path)}
      selected={selected}
      defaultExpandIcon={<ExpandMoreIcon />}
    >
      {nav.filter(isChild(guidePath)).map((item) => renderItem(item, nav))}
    </TreeView>
  </Stack>
);

export default ProductGuideMenu;
