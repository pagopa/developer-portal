import { mediaVectorJson } from './media';
import { bannerLinksJson } from '@/lib/strapi/__tests__/fixtures/bannerLinksJson';

export const baseProductJson = {
  data: {
    id: 8,
    attributes: {
      name: 'Firma con IO',
      slug: 'firma-con-io',
      shortName: 'Firma con IO',
    },
  },
};

export const productJson = {
  data: {
    id: 8,
    attributes: {
      name: 'Firma con IO',
      description:
        'Richiedi la Firma Elettronica Certificata su contratti e documenti. Le cittadine e i cittadini possono firmare direttamente sull’app IO.',
      slug: 'firma-con-io',
      createdAt: '2024-03-26T16:05:30.593Z',
      updatedAt: '2024-07-11T19:28:06.709Z',
      publishedAt: '2024-03-26T16:05:32.226Z',
      locale: 'it',
      shortName: 'Firma con IO',
      logo: mediaVectorJson,
      bannerLinks: bannerLinksJson,
      overview: { data: null },
      quickstart_guide: { data: null },
      api_data_list_page: { data: null },
      tutorial_list_page: { data: null },
      guide_list_page: { data: null },
      release_note: { data: null },
    },
  },
};

export const productsJson = {
  data: [productJson.data],
};
