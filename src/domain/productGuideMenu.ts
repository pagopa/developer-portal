import { IOTechGuide } from '@/adapters/static/staticProductGuideNav';

// TODO Union type of PageGuideMenuItem and GroupGuideMenuItem (group doesn't have description)
export type ProductGuideMenuItem = {
  title: string;
  kind: 'page' | 'group';
  description?: string;
  path: string;
  slug: string;
  pages: ReadonlyArray<ProductGuideMenuItem>;
};

export type ProductGuideMenu = ReadonlyArray<ProductGuideMenuItem>;

export const getProductGuideMenu = (
  productSlug: string,
  guideSlug: string,
  versionSlug: string
): ProductGuideMenu => IOTechGuide;
