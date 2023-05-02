import { isChild } from '../productGuideNavigator';

describe('isChild', () => {
  it('should return true if the given nav is a child of path', () => {
    const actual = isChild('/guide-root/page-1')({
      kind: 'page',
      path: '/guide-root/page-1/page-1-1',
      name: { nav: 'page-1-1', breadcrumb: 'page-1-1' },
    });
    expect(actual).toStrictEqual(true);
  });
  it('should return false if the given nav is not a child of path', () => {
    const actual = isChild('/guide-root/page-1')({
      kind: 'page',
      path: '/guide-root/page-1/page-1-1/page-1-1-1',
      name: { nav: 'page-1-1-1', breadcrumb: 'page-1-1-1' },
    });
    expect(actual).toStrictEqual(false);
  });
});
