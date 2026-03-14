import { StrapiCaseHistory } from '@/lib/strapi/types/caseHistories';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { product } from '@/lib/strapi/__tests__/fixtures/product';
import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';
import { Paginated } from '@/lib/strapi/types/paginated';

export const strapiCaseHistories: Paginated<StrapiCaseHistory> = {
  data: [
    {
      id: 1,
      slug: 'case-history-title',
      title: 'Case History Title',
      description: 'Case history description',
      publishedAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      image: mediaJpeg(),
      products: [
        {
          ...product,
          logo: mediaJpeg(),
        },
      ],
      parts: [
        {
          __component: 'parts.code-block',
          code: 'console.log("Hello World");',
          language: 'javascript',
          showLineNumbers: true,
        },
      ],
      seo: {
        metaTitle: 'SEO Title',
        metaDescription: 'SEO Description',
      },
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

export const caseHistoriesPageTemplateProps: CaseHistoryPageTemplateProps = {
  slug: 'case-history-title',
  title: 'Case History Title',
  description: 'Case history description',
  updatedAt: '2024-01-02T00:00:00.000Z',
  image: mediaJpeg(),
  products: [
    {
      name: product.name,
      slug: product.slug,
      logo: mediaJpeg(),
    },
  ],
  parts: [
    {
      component: 'codeBlock' as const,
      code: 'console.log("Hello World");',
      language: 'javascript',
      showLineNumbers: true,
    },
  ],
  seo: {
    metaTitle: 'SEO Title',
    metaDescription: 'SEO Description',
  },
};
