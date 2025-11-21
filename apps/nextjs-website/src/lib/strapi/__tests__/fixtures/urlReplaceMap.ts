import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';
import { productJson } from './product';

export const strapiUrlReplaceMapFixture: StrapiUrlReplaceMap = {
  data: {
    urlToGuide: [
      {
        id: 1,
        url: 'getting-started',
        subPath: 'step-2',
        guide: {
          data: {
            title: 'Getting started',
            slug: 'getting-started',
            product: {
              data: {
                slug: productJson.data.slug,
              },
            },
          },
        },
      },
    ],
  },
};

export const expectedUrlReplaceMapFixture = {
  'getting-started': '/firma-con-io/guides/getting-started/step-2',
};
