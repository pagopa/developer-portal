import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as b from 'fp-ts/lib/boolean';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import Link from 'next/link';
import * as React from 'react';
import { ProductGuidePage } from '@/domain/productGuidePage';
import { Menu } from '@/domain/navigator';
import { useRouter } from 'next/router';
import {
  ProductGuideMenu,
  ProductGuideMenuItem,
} from '@/domain/productGuideMenu';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export type ProductGuidePageProps = ProductGuidePage & {
  navLinks: Menu;
  productGuideNavLinks: ProductGuideMenu;
};

const renderMenuItemText =
  (isCurrent: boolean) => (menuItem: ProductGuideMenuItem) =>
    pipe(
      <Typography
        variant='sidenav'
        color={isCurrent ? 'primary.main' : 'text.primary'}
        key={menuItem.title}
        component={Link}
        href={menuItem.path}
        sx={{ textDecoration: 'none', fontSize: 16 }}
      >
        {menuItem.title}
      </Typography>
    );

const renderGroup =
  (
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleClick: () => void
  ) =>
  (currentPath: string) =>
  ({ title: groupName, pages }: ProductGuideMenuItem) =>
    pipe(
      <Stack mt={5} spacing={1}>
        <Typography
          color='text.secondary'
          textTransform='uppercase'
          sx={{
            fontSize: 14,
          }}
        >
          {groupName}
        </Typography>
        {pipe(
          pages,
          RA.map(renderPage(open, setOpen, handleClick)(currentPath))
        )}
      </Stack>
    );

const renderPage =
  (
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleClick: () => void
  ) =>
  (currentPath: string) =>
  (menuItem: ProductGuideMenuItem) =>
    pipe(menuItem.pages, (pages) =>
      pipe(
        pages,
        RA.isEmpty,
        b.fold(
          // // If page has children, render a collapsible list
          () => (
            <>
              <ListItemButton onClick={handleClick}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  spacing={2}
                >
                  {renderMenuItemText(currentPath.includes(menuItem.path))(
                    menuItem
                  )}
                  {open ? <ExpandLess /> : <ExpandMore />}
                </Stack>
              </ListItemButton>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <Box>
                  <List component='div'>
                    {pipe(
                      menuItem.pages,
                      RA.map(
                        renderPage(open, setOpen, handleClick)(currentPath)
                      )
                    )}
                  </List>
                </Box>
              </Collapse>
            </>
          ),
          () => (
            // If page hasn't children, render a simple list item
            <ListItemButton>
              {renderMenuItemText(currentPath.includes(menuItem.path))(
                menuItem
              )}
            </ListItemButton>
          )
        )
      )
    );

const ProductGuideNav = ({
  title,
  versionSlug,
  productGuideNavLinks,
}: ProductGuidePageProps) => {
  const currentPath = useRouter().asPath;

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Stack spacing={2} bgcolor='background.default' sx={{ pl: 2 }}>
      <Box sx={{ p: 1, mt: 8 }}>
        <Typography variant='h6'>{title}</Typography>
      </Box>
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader
            component='div'
            id='nested-list-subheader'
            sx={{ bgcolor: 'background.default' }}
          >
            <Typography color='text.secondary'>
              Versione {versionSlug}
            </Typography>
          </ListSubheader>
        }
      >
        {pipe(
          productGuideNavLinks,
          RA.map((menuItem) =>
            menuItem.kind === 'group'
              ? renderGroup(isOpen, setIsOpen, handleClick)(currentPath)(
                  menuItem
                )
              : renderPage(isOpen, setIsOpen, handleClick)(currentPath)(
                  menuItem
                )
          )
        )}
      </List>
    </Stack>
  );
};

export default ProductGuideNav;
