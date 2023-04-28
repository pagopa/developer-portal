import { ProductGuideMenu } from '@/domain/productGuideNavigator';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { TreeItem, TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type ProductGuideNavProps = {
  title: string;
  versions: string;
  items: ProductGuideMenu;
  selected?: string;
  expanded?: Array<string>;
};

const customStyle = {
  '& .MuiTreeItem-content': {
    flexDirection: 'row-reverse',
    pl: 2,
    py: 1,
  },
  '& .MuiTreeItem-label': {
    p: 0,
  },
  '& .MuiCollapse-root': {
    m: 0,
    pl: 2,
  },
}

const renderItem = (item: ProductGuideMenu[0]) => {
  const label =
    item.kind === 'page' ? (
      <Typography
        variant='sidenav'
        component={Link}
        href={item.path}
        style={{ textDecoration: 'none' }}
      >
        {item.name}
      </Typography>
    ) : item.kind === 'group' ? (
      <Typography
        color='text.secondary'
        textTransform='uppercase'
        fontSize={14}
        style={{ textDecoration: 'none' }}
      >
        {item.name}
      </Typography>
    ) : (
      <Typography
        variant='sidenav'
        component={Link}
        href={item.href}
        title={item.name}
        style={{ textDecoration: 'none' }}
      >
        {item.name}
      </Typography>
    );
  return (
    <TreeItem
      key={item.name}
      nodeId={ (item.kind === 'link') ? item.href : item.path }
      label={label}
      disabled={item.kind === 'group'}
      icon={item.kind === 'link' ? <OpenInNewIcon /> : undefined}
      sx={customStyle}
    >
      {item.kind === 'page' ? item.children.map(renderItem) : undefined}
    </TreeItem>
  );
};

const ProductGuideNav = ({ title, versions, items, selected, expanded }: ProductGuideNavProps) => (
  <Stack bgcolor='background.default' sx={{ px: 3, py: 10 }}>
    <Typography variant='h6'>{title}</Typography>
    <Typography color='text.secondary'>Versione {versions}</Typography>
    <TreeView
      defaultCollapseIcon={<ExpandLessIcon />}
      defaultExpanded={expanded}
      selected={selected}
      defaultExpandIcon={<ExpandMoreIcon />}
    >
      {items.map(renderItem)}
    </TreeView>
  </Stack>
);

export default ProductGuideNav;
