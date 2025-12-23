import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';
import { productJson } from './product';

export const strapiUrlReplaceMapFixture: StrapiUrlReplaceMap = {
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

export const expectedUrlReplaceMapFixture = {
  'getting-started': '/firma-con-io/guides/getting-started/step-2',
};
