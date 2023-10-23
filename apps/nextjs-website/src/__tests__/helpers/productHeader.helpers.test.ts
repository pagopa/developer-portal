import { productToMenuItems } from '../../helpers/productHeader.helper';
import { Product } from '@/lib/types/product';

const product: Product = {
  name: 'test',
  description: 'test',
  svgPath: 'test',
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
};

it('should convert product to menu items', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    product,
    '/path/overview_path',
    themeLight
  );
  expect(menuItems.length).toEqual(3);
  const overviewItem = menuItems.find(
    ({ href }) => href === product.subpaths.overview.path
  );
  expect(overviewItem).not.toBeUndefined();
  expect(overviewItem?.label).toBe(product.subpaths.overview.name);
  expect(overviewItem?.href).toBe(product.subpaths.overview.path);
  expect(overviewItem?.active).toBeTruthy();
  expect(overviewItem?.theme).toBe(themeLight);
});

it('should return the correct active value', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    product,
    '/guides/some-guide/some-guide-version/some-guide-page',
    themeLight
  );
  expect(menuItems.length).toEqual(3);
  const overviewItem = menuItems.find(
    ({ href }) => href === product.subpaths.guides?.path
  );
  expect(overviewItem).not.toBeUndefined();
  expect(overviewItem?.label).toBe(product.subpaths.guides?.name);
  expect(overviewItem?.href).toBe(product.subpaths.guides?.path);
  expect(overviewItem?.active).toBeTruthy();
  expect(overviewItem?.theme).toBe(themeLight);
});

it('should return the correct active value if the subpath.path contains the path', () => {
  const themeLight = 'light';
  const menuItems = productToMenuItems(
    product,
    '/path/tutorial_path/some-tutorial/some-tutorial-version/guides',
    themeLight
  );
  expect(menuItems.length).toEqual(3);
  const overviewItem = menuItems.find(
    ({ href }) => href === product.subpaths.guides?.path
  );
  expect(overviewItem).not.toBeUndefined();
  expect(overviewItem?.active).toBeFalsy();
  expect(overviewItem?.theme).toBe(themeLight);
});
