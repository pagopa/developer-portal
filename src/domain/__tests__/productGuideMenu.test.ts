import {
  isCurrent,
  isOnAChildPage,
  ProductGuideMenuItem,
} from '../productGuideMenu';

const menuItemPage: ProductGuideMenuItem = {
  kind: 'page',
  title: 'some title',
  description: '',
  path: '/some/path/slug',
  slug: 'slug',
  pages: [],
};

const menuItemGroup: ProductGuideMenuItem = {
  kind: 'group',
  title: 'some group title',
  path: '/some/path',
  slug: '',
  pages: [menuItemPage],
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
      expect(isOnAChildPage(currentPath, menuItemGroup)).toStrictEqual(true);
    });

    it('should return false if currentPath does not contain a page slug from menuItem', () => {
      expect(isOnAChildPage(anotherPath, menuItemGroup)).toStrictEqual(false);
    });
  });
});
