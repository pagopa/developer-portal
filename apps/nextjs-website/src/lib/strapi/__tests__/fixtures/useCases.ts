import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { product } from '@/lib/strapi/__tests__/fixtures/product';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { StrapiUseCases } from '../../types/useCase';

export const strapiUseCases: StrapiUseCases = {
  data: [
    {
      title: 'UseCase Title',
      subtitle: 'UseCase Subtitle',
      slug: 'use-case-title',
      publishedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
      coverImage: mediaJpeg(),
      headerImage: mediaJpeg(),
      locale: 'en-US',
      product: {
        ...product,
        bannerLinks: generateBannerLinks(1),
      },
      parts: [
        {
          __component: 'parts.code-block',
          code: 'console.log("Hello World");',
          language: 'javascript',
          showLineNumbers: true,
        },
      ],
      bannerLinks: generateBannerLinks(1),
      relatedLinks: {
        title: 'Related Links',
        links: [
          {
            text: 'Link 1',
            href: '/link-1',
          },
        ],
      },
      seo: {
        metaTitle: 'SEO Title',
        metaDescription: 'SEO Description',
      },
      tags: [
        {
          name: 'Tag1',
          icon: mediaJpeg(),
        },
      ],
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
};
