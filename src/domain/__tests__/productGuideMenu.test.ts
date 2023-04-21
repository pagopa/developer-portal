import {
  isCurrent,
  isOnAChildPage,
  ProductGuideMenuPage,
} from '../productGuideMenu';

const menuItemPage: ProductGuideMenuPage = {
  kind: 'page',
  title: 'some title',
  path: '/some/path/slug',
  slug: 'slug',
  pages: [
    {
      kind: 'page',
      title: 'some title sub page',
      path: '/some/path/slug/sub-page',
      slug: 'sub-page',
      pages: [],
    },
  ],
};

describe('productGuideMenu', () => {
  const currentPath = '/some/path/slug';
  const anotherPath = '/some/other/path';
  describe('isCurrent', () => {
    it('should return true if currentPath contains menuItem slug', () => {
      expect(isCurrent(currentPath, menuItemPage)).toStrictEqual(true);
    });

    it('should return false if currentPath does not contain menuItem slug', () => {
      expect(isCurrent(anotherPath, menuItemPage)).toStrictEqual(false);
      expect(isCurrent('/', menuItemPage)).toStrictEqual(false);
    });
  });

  describe('isOnAChildPage', () => {
    it('should return true if currentPath contains a page slug from menuItem', () => {
      expect(
        isOnAChildPage(`${currentPath}/sub-page`, menuItemPage)
      ).toStrictEqual(true);
    });

    it('should return false if currentPath does not contain a page slug from menuItem', () => {
      expect(isOnAChildPage(anotherPath, menuItemPage)).toStrictEqual(false);
    });
  });
});
