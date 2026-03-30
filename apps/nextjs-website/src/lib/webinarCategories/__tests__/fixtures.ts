import { StrapiWebinarCategories } from '@/lib/webinarCategories/strapiTypes';
import { mediaJpeg } from '@/lib/media/__tests__/factories';

export const strapiWebinarCategories: StrapiWebinarCategories = {
  data: [
    {
      id: 1,
      name: 'Payments',
      icon: mediaJpeg(),
    },
    {
      id: 2,
      name: 'Onboarding',
      icon: mediaJpeg(),
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 2,
    },
  },
};
