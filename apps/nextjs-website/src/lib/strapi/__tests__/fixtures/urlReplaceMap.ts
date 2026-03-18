import { productJson } from './product';
import { wrapAsRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export const strapiUrlReplaceMapFixture = wrapAsRootEntity({
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
});

export const expectedUrlReplaceMapFixture = {
  'getting-started': '/it/firma-con-io/guides/getting-started/step-2',
};
