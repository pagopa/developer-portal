import { productJson } from '@/lib/products/__tests__/fixtures';
import type { StrapiUrlReplaceMap } from '@/lib/urlReplaceMap/types';

export const strapiUrlReplaceMap: StrapiUrlReplaceMap = {
  urlToGuide: [
    {
      id: 1,
      url: 'getting-started',
      subPath: 'step-2',
      guide: {
        title: 'Getting started',
        slug: 'getting-started',
        product: {
          slug: productJson.slug,
        },
      },
    },
  ],
};

export const expectedUrlReplaceMap = {
  'getting-started': '/it/firma-con-io/guides/getting-started/step-2',
};
