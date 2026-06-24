import { mediaJpeg } from '@/lib/media/__tests__/factories';
import type { StrapiTags } from '@/lib/tags/strapiTypes';

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
