import { Product } from '@/lib/types/product';

export const mockProduct: Product = {
  name: 'test',
  description: 'test',
  svgPath: 'test',
  path: '/path',
  subpaths: {
    overview: {
      name: 'overview',
      path: '/path/overview_path',
    },
    tutorials: {
      name: 'tutorials',
      path: '/path/tutorial_path',
    },
  },
};
