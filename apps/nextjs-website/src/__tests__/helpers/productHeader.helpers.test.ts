import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';

const product: Product = {
  name: 'test',
  shortName: 'test',
  description: 'test',
  logo: {
    alternativeText: undefined,
    caption: undefined,
    size: 10,
    name: 'test',
    width: 60,
    height: 61,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: 'test',
  },
  path: '/path',
  slug: 'path',
  subpaths: {
    overview: {
      name: 'overview',
      path: '/path/overview_path',
    },
    tutorials: {
      name: 'tutorials',
      path: '/path/tutorial_path',
    },
    guides: {
      name: 'guides',
      path: '/guides',
    },
  },
  bannerLinks: [],
};

it('should convert product to menu items', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    product,
    '/path/overview_path',
    themeLight
  );
  expect(menuItems.length).toEqual(1);
});

it('should return the correct active value', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    product,
    '/guides/some-guide/some-guide-version/some-guide-page',
    themeLight
  );
  expect(menuItems.length).toEqual(1);
});

it('should return the correct active value if the subpath.path contains the path', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    product,
    '/path/tutorial_path/some-tutorial/some-tutorial-version/guides',
    themeLight
  );
  expect(menuItems.length).toEqual(1);
});
