import { makeMenu, makeBreadcrumbs } from '../navigator';

const product = { rootPath: '/products', name: 'Product 1' };

const productNavItem = {
  path: '/products',
  name: { breadcrumb: 'Product' },
};

const productFooNavItem = {
  path: '/products/foo',
  name: { breadcrumb: 'Foo' },
};
const productBarNavItem = {
  path: '/products/bar',
  name: { breadcrumb: 'Bar', nav: 'Bar Nav' },
};

describe('makeMenu', () => {
  it('should return an empty array when the navigation is empty', () => {
    const actual = makeMenu([], product);
    expect(actual).toStrictEqual([]);
  });

  it('should only include children items and items with a nav value', () => {
    const { path, name } = productBarNavItem;
    const nav = [productBarNavItem, productFooNavItem];
    const actual = makeMenu(nav, product);
    expect(actual).toStrictEqual([{ path, name: name.nav }]);
  });
});

describe('makeBreadcrumbs', () => {
  it('should return empty breadcrumbs for an unknown path', () => {
    const breadcrumbs = makeBreadcrumbs([productNavItem], '/unknown/path');
    expect(breadcrumbs).toStrictEqual([]);
  });

  it('should return breadcrumbs for the root path', () => {
    const breadcrumbs = makeBreadcrumbs(
      [productFooNavItem, productNavItem],
      productNavItem.path
    );

    expect(breadcrumbs).toStrictEqual([
      {
        path: productNavItem.path,
        name: productNavItem.name.breadcrumb,
        isCurrent: true,
      },
    ]);
  });

  it('should return breadcrumbs for a child path', () => {
    const breadcrumbs = makeBreadcrumbs(
      [productFooNavItem, productNavItem, productBarNavItem],
      productFooNavItem.path
    );

    expect(breadcrumbs).toStrictEqual([
      {
        path: productNavItem.path,
        name: productNavItem.name.breadcrumb,
        isCurrent: false,
      },
      {
        path: productFooNavItem.path,
        name: productFooNavItem.name.breadcrumb,
        isCurrent: true,
      },
    ]);
  });
});
