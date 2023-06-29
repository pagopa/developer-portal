/* eslint-disable functional/no-expression-statements */
import { productToMenuItems } from '@/helpers/productHeader.helper';
import { Product } from '@/lib/types/product';

const product: Product = {
  name: 'test',
  path: '/path',
  subpaths: {
    overview: {
      name: 'overview',
      path: '/path/overview_path',
    },
    tutorial: {
      name: 'tutorial',
      path: '/path/tutorial_path',
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
  expect(menuItems.length).toEqual(2);
  const overviewItem = menuItems.find(
    ({ href }) => href === product.subpaths.overview.path
  );
  expect(overviewItem).not.toBeUndefined();
  expect(overviewItem?.label).toBe(product.subpaths.overview.name);
  expect(overviewItem?.href).toBe(product.subpaths.overview.path);
  expect(overviewItem?.active).toBeTruthy();
  expect(overviewItem?.theme).toBe(themeLight);
});
