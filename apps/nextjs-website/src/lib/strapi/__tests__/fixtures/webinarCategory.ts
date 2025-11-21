import { StrapiWebinarCategories } from '@/lib/strapi/types/webinarCategory';
import { mediaJpeg } from '../factories/media';

export const strapiWebinarCategories: StrapiWebinarCategories = {
  data: [
    {
      id: 1,
      name: 'Payments',
      icon: { data: mediaJpeg() },
    },
    {
      id: 2,
      name: 'Onboarding',
      icon: { data: mediaJpeg() },
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
