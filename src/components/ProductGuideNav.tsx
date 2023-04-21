import { Box, Collapse, List, Stack, Typography } from '@mui/material';
import { flow, pipe } from 'fp-ts/lib/function';
import * as b from 'fp-ts/lib/boolean';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as React from 'react';
import { ProductGuidePage } from '@/domain/productGuidePage';
import { Menu } from '@/domain/navigator';
import { useRouter } from 'next/router';
import {
  isCurrent,
  isOnAChildPage,
  ProductGuideMenu,
  ProductGuideMenuPage,
} from '@/domain/productGuideMenu';
import ListItemButton from '@/components/ListItemButton';
import ListSubheader from '@/components/ListSubheader';

export type ProductGuidePageProps = ProductGuidePage & {
  navLinks: Menu;
  productGuideNavLinks: ProductGuideMenu;
};

const makeProductGuidePageRef = (
  {
    product: { slug: productSlug },
    guideSlug,
    versionSlug,
  }: ProductGuidePageProps,
  menuItem: ProductGuideMenuPage
) =>
  `/${productSlug}/guide-manuali/${guideSlug}/${versionSlug}/${menuItem.slug}`;

/**
 * Renders a collapsible list for a product guide menu page.
 *
 * @param {ProductGuideMenuPage} menuItem - The menu item to render.
 * @param {ProductGuideNavOpenState} isOpen - The open state of the product guide navigation.
 * @param {(id: string) => void} handleClick - The function to handle clicks on the list item.
 * @param {string} currentPath - The current path of the page.
 * @param {ProductGuidePageProps} productGuideProps - The props for the product guide page.
 * @param {boolean} isCurrentItem - Whether the menu item is the current item.
 * @param {string} productGuidePageRef - The reference to the product guide page.
 * @returns {JSX.Element} The rendered collapsible list.
 */
const renderCollapsibleList = (
  menuItem: ProductGuideMenuPage,
  isOpen: ProductGuideNavOpenState,
  handleClick: (id: string) => void,
  currentPath: string,
  productGuideProps: ProductGuidePageProps,
  isCurrentItem: boolean,
  productGuidePageRef: string
) => {
  const collapseOpen =
    isOnAChildPage(currentPath, menuItem) || isOpen[menuItem.slug];
  return (
    <>
      <ListItemButton
        kind={'withChildren'}
        text={menuItem.title}
        isCurrent={isCurrentItem}
        href={productGuidePageRef}
        onClick={() => handleClick(menuItem.slug)}
        collapseOpen={collapseOpen}
      />
      <Collapse in={collapseOpen} timeout='auto' unmountOnExit>
        <Box sx={{ ml: 2 }}>
          <List component='div'>
            {pipe(
              menuItem.pages,
              RA.map(
                renderMenuItemPage(isOpen, handleClick)(
                  currentPath,
                  productGuideProps
                )
              )
            )}
          </List>
        </Box>
      </Collapse>
    </>
  );
};

/**
 * Renders a simple list item for a product guide menu page.
 *
 * @param {ProductGuideMenuPage} menuItem - The menu item to render.
 * @param {boolean} isCurrentItem - Whether the menu item is the current item.
 * @param {string} productGuidePageRef - The reference to the product guide page.
 * @returns {JSX.Element} The rendered list item.
 */
const renderSimpleListItem = (
  menuItem: ProductGuideMenuPage,
  isCurrentItem: boolean,
  productGuidePageRef: string
) => (
  <ListItemButton
    kind={'single'}
    text={menuItem.title}
    isCurrent={isCurrentItem}
    href={productGuidePageRef}
  />
);

/**
 * Renders a menu item for a product guide page.
 *
 * @param {ProductGuideNavOpenState} isOpen - The open state of the product guide navigation.
 * @param {(id: string) => void} handleClick - The function to handle clicks on the list item.
 * @returns {(currentPath: string, guidePath: string) => (menuItem: ProductGuideMenuPage) => JSX.Element} A function that takes the current path and guide path and returns a function that takes a menu item and returns the rendered menu item.
 */
const renderMenuItemPage =
  (isOpen: ProductGuideNavOpenState, handleClick: (id: string) => void) =>
  (currentPath: string, productGuideProps: ProductGuidePageProps) =>
  (menuItem: ProductGuideMenuPage) =>
    pipe(
      menuItem.pages,
      flow(
        RA.isEmpty,
        b.fold(
          // If page has children, render a collapsible list
          () =>
            renderCollapsibleList(
              menuItem,
              isOpen,
              handleClick,
              currentPath,
              productGuideProps,
              isCurrent(currentPath, menuItem),
              makeProductGuidePageRef(productGuideProps, menuItem)
            ),
          // If page hasn't children, render a simple list item
          () =>
            renderSimpleListItem(
              menuItem,
              isCurrent(currentPath, menuItem),
              makeProductGuidePageRef(productGuideProps, menuItem)
            )
        )
      )
    );

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
        sx={{ py: 4 }}
      >
        {pipe(
          productGuideProps.productGuideNavLinks,
          RA.mapWithIndex((index, menuItem) =>
            menuItem.kind === 'group' ? (
              <ListSubheader key={index} title={menuItem.title} />
            ) : (
              renderMenuItemPage(openState, handleClick)(
                currentPath,
                productGuideProps
              )(menuItem)
            )
          )
        )}
      </List>
    </Stack>
  );
};

export default ProductGuideNav;
