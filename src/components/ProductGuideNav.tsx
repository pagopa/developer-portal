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
  isCurrent,
  isOnAChildPage,
  ProductGuideMenu,
  ProductGuideMenuItem,
} from '@/domain/productGuideMenu';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export type ProductGuidePageProps = ProductGuidePage & {
  navLinks: Menu;
  productGuideNavLinks: ProductGuideMenu;
};

const renderMenuItemText =
  (isCurrent: boolean) =>
  (
    menuItem: ProductGuideMenuItem,
    {
      product: { slug: productSlug },
      guideSlug,
      versionSlug,
    }: ProductGuidePageProps
  ) =>
    pipe(
      <Typography
        variant='sidenav'
        color={isCurrent ? 'primary.main' : 'text.primary'}
        key={menuItem.slug}
        component={(props) => {
          return (
            <Link
              href={menuItem.slug}
              as={`/${productSlug}/guide-manuali/${guideSlug}/${versionSlug}/${menuItem.slug}`}
              {...props}
            />
          );
        }}
        sx={{ textDecoration: 'none', fontSize: 16 }}
      >
        {menuItem.title}
      </Typography>
    );

/**
 * This function renders a group of pages.
 */
const renderMenuItemGroup =
  (
    isOpen: ProductGuideNavOpenState,
    setOpen: React.Dispatch<React.SetStateAction<ProductGuideNavOpenState>>,
    handleClick: (_: string) => void
  ) =>
  (currentPath: string, productGuideProps: ProductGuidePageProps) =>
  ({ title: groupName, pages }: ProductGuideMenuItem) =>
    pipe(
      <Stack mt={5} spacing={1}>
        <Typography
          color='text.secondary'
          textTransform='uppercase'
          sx={{
            fontSize: 14,
            ml: 2,
          }}
        >
          {groupName}
        </Typography>
        {pipe(
          pages,
          RA.map(
            renderMenuItemPage(
              isOpen,
              setOpen,
              handleClick
            )(currentPath, productGuideProps)
          )
        )}
      </Stack>
    );

/**
 * This function renders a page (note that a page can contain a list of child pages, so it can call itself recursively).
 */
const renderMenuItemPage =
  (
    isOpen: ProductGuideNavOpenState,
    setOpen: React.Dispatch<React.SetStateAction<ProductGuideNavOpenState>>,
    handleClick: (id: string) => void
  ) =>
  (currentPath: string, productGuideProps: ProductGuidePageProps) =>
  (menuItem: ProductGuideMenuItem) => {
    const collapseOpen =
      isOnAChildPage(currentPath, menuItem) || isOpen[menuItem.slug];
    return pipe(menuItem.pages, (pages) =>
      pipe(
        pages,
        RA.isEmpty,
        b.fold(
          // // If page has children, render a collapsible list
          () => (
            <>
              <ListItemButton onClick={() => handleClick(menuItem.slug)}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  spacing={2}
                  width={1}
                >
                  {renderMenuItemText(isCurrent(currentPath, menuItem))(
                    menuItem,
                    productGuideProps
                  )}
                  {collapseOpen ? <ExpandLess /> : <ExpandMore />}
                </Stack>
              </ListItemButton>
              <Collapse in={collapseOpen} timeout='auto' unmountOnExit>
                <Box sx={{ ml: 2 }}>
                  <List component='div'>
                    {pipe(
                      menuItem.pages,
                      RA.map(
                        renderMenuItemPage(
                          isOpen,
                          setOpen,
                          handleClick
                        )(currentPath, productGuideProps)
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
              {renderMenuItemText(isCurrent(currentPath, menuItem))(
                menuItem,
                productGuideProps
              )}
            </ListItemButton>
          )
        )
      )
    );
  };

type ProductGuideNavOpenState = { [key: string]: boolean };

const ProductGuideNav = (productGuideProps: ProductGuidePageProps) => {
  const currentPath = useRouter().asPath;

  const [openState, setOpen] = React.useState<ProductGuideNavOpenState>({});

  const handleClick = (id: string) => {
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  return (
    <Stack bgcolor='background.default' sx={{ px: 3, py: 10 }}>
      <Typography variant='h6'>{productGuideProps.title}</Typography>
      <Typography color='text.secondary'>
        Versione {productGuideProps.versionSlug}
      </Typography>
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        sx={{py: 4}}
      >
        {pipe(
          productGuideProps.productGuideNavLinks,
          RA.map((menuItem) =>
            menuItem.kind === 'group' // If menu item is a group, it has a different type so we render it differently
              ? renderMenuItemGroup(
                  openState,
                  setOpen,
                  handleClick
                )(
                  currentPath,
                  productGuideProps
                )(menuItem)
              : renderMenuItemPage(
                  openState,
                  setOpen,
                  handleClick
                )(
                  currentPath,
                  productGuideProps
                )(menuItem)
          )
        )}
      </List>
    </Stack>
  );
};

export default ProductGuideNav;
