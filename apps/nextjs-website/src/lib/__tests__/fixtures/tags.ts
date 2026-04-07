import { mediaJpeg } from '@/lib/__tests__/factories/media';
import { StrapiTags } from '@/lib/tags/types';

export const strapiTags: StrapiTags = {
  data: [
    {
      name: 'Payments',
      icon: mediaJpeg(),
    },
    {
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
