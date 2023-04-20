type ProductGuideMenuPage = {
  title: string;
  kind: 'page';
  description: string;
  path: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideMenuPage>;
};

type ProductGuideMenuGroup = {
  title: string;
  kind: 'group';
  path: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideMenuPage>;
};

export type ProductGuideMenuItem = ProductGuideMenuPage | ProductGuideMenuGroup;

export type ProductGuideMenu = ReadonlyArray<ProductGuideMenuItem>;
