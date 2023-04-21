import { Box, Collapse, List, Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
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
 * This function renders a page (note that a page can contain a list of child pages, so it can call itself recursively).
 */
const renderMenuItemPage =
  (isOpen: ProductGuideNavOpenState, handleClick: (id: string) => void) =>
  (currentPath: string, productGuideProps: ProductGuidePageProps) =>
  (menuItem: ProductGuideMenuPage) => {
    const collapseOpen =
      isOnAChildPage(currentPath, menuItem) || isOpen[menuItem.slug];
    const isCurrentItem = isCurrent(currentPath, menuItem);
    const productGuidePageRef = makeProductGuidePageRef(
      productGuideProps,
      menuItem
    );
    return pipe(menuItem.pages, (pages) =>
      pipe(
        pages,
        RA.isEmpty,
        b.fold(
          // If page has children, render a collapsible list
          () => (
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
          ),
          () => (
            // If page hasn't children, render a simple list item
            <ListItemButton
              kind={'single'}
              text={menuItem.title}
              isCurrent={isCurrentItem}
              href={productGuidePageRef}
            />
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
