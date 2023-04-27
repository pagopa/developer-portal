import { ProductGuideNav } from '@/domain/productGuideNavigator';
import { makeProductGuideNav } from '../makeProductGuideNav';
import { gitBookProductGuideItemList } from './data';

describe('makeProductGuideNav', () => {
  it('should produce the navigator', () => {
    const actual = makeProductGuideNav(gitBookProductGuideItemList, []);
    const expected: ProductGuideNav = [
      {
        href: 'anHref',
        kind: 'link',
        name: {
          breadcrumb: 'aTitle',
          nav: 'aTitle',
        },
        path: '/parent',
      },
      {
        kind: 'page',
        name: {
          breadcrumb: 'aTitle',
          nav: 'aTitle',
        },
        path: '/parent/aSlug0/aSlug00',
      },
      {
        kind: 'page',
        name: {
          breadcrumb: 'aTitle',
          nav: 'aTitle',
        },
        path: '/parent/aSlug0',
      },
    ];
    expect(actual).toStrictEqual(expected);
  });
});
