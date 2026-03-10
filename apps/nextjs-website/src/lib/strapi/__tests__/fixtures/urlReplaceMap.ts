import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';
import { productJson } from './product';

export const strapiUrlReplaceMapFixture: StrapiUrlReplaceMap = {
  data: {
    attributes: {
      urlToGuide: [
        {
          id: 1,
          url: 'getting-started',
          subPath: 'step-2',
          guide: {
            data: {
              attributes: {
                title: 'Getting started',
                slug: 'getting-started',
                product: {
                  data: {
                    attributes: {
                      slug: productJson.data.attributes.slug,
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export const expectedUrlReplaceMapFixture = {
  'getting-started': '/it/firma-con-io/guides/getting-started/step-2',
};
