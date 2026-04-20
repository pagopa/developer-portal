import { generateBannerLinks } from '@/lib/bannerLink/__tests__/factories';
import { mediaJpeg } from '@/lib/media/__tests__/factories';
import { product } from '@/lib/products/__tests__/fixtures';
import { StrapiTutorials } from '@/lib/tutorials/strapiTypes';

export const strapiTutorials: StrapiTutorials = {
  data: [
    {
      description: '',
      icon: mediaJpeg(),
      tags: [],
      title: 'Tutorial Title',
      slug: 'tutorial-title',
      publishedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
      image: mediaJpeg(),
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
