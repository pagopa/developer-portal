import { ProductGuideNav, getDirectChildrenOf } from '../productGuideNavigator';

const nav: ProductGuideNav = [
  {
    kind: 'page',
    path: '/guide-root/page-1',
    name: { nav: 'page-1', breadcrumb: 'page-1' },
  },
  {
    kind: 'page',
    path: '/guide-root/page-1/page-1-1',
    name: { nav: 'page-1-1', breadcrumb: 'page-1-1' },
  },
  {
    kind: 'page',
    path: '/guide-root/page-1/page-1-1/page-1-1-1',
    name: { nav: 'page-1-1-1', breadcrumb: 'page-1-1-1' },
  },

  {
    kind: 'group',
    path: '/guide-root/group-1',
    name: { nav: 'group-1', breadcrumb: 'group-1' },
  },
  {
    kind: 'link',
    path: '/guide-root/link-1',
    name: { nav: 'link-1', breadcrumb: 'link-1' },
    href: 'anHref',
  },
];

describe('getDirectChildrenOf', () => {
  it('should return the direct children of a given nav item', () => {
    const actual = getDirectChildrenOf('/guide-root/page-1', nav);
    const expected = [
      {
        kind: 'page',
        path: '/guide-root/page-1/page-1-1',
        name: { nav: 'page-1-1', breadcrumb: 'page-1-1' },
      },
    ];
    expect(actual).toStrictEqual(expected);
  });
});
