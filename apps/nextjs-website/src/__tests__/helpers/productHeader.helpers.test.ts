import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';

const product: Product = {
  isVisible: true,
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
  slug: 'path',
  hasOverviewPage: true,
  bannerLinks: [],
};

it('should convert product to menu items', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    'it',
    product,
    '/path/overview_path',
    themeLight
  );
  expect(menuItems.length).toEqual(1);
});

it('should not have menu items has no supbath available', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    'it',
    { ...product, hasOverviewPage: false },
    '/path/overview_path',
    themeLight
  );
  expect(menuItems.length).toEqual(0);
});

it('should return the correct active value', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    'it',
    product,
    '/guides/some-guide/some-guide-version/some-guide-page',
    themeLight
  );
  expect(menuItems.length).toEqual(1);
});

it('should return the correct active value if the subpath.path contains the path', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    'it',
    product,
    '/path/tutorial_path/some-tutorial/some-tutorial-version/guides',
    themeLight
  );
  expect(menuItems.length).toEqual(1);
});
