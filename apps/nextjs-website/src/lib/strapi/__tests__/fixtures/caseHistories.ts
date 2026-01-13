import { StrapiCaseHistories } from '@/lib/strapi/types/caseHistories';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { product } from '@/lib/strapi/__tests__/fixtures/product';
import { CaseHistoryPageTemplateProps } from '@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate';

export const strapiCaseHistories: StrapiCaseHistories = {
  data: [
    {
      id: 1,
      attributes: {
        slug: 'case-history-title',
        title: 'Case History Title',
        description: 'Case history description',
        publishedAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        image: { data: mediaJpeg() },
        products: {
          data: [
            {
              attributes: {
                ...product,
                logo: {
                  data: mediaJpeg(),
                },
              },
            },
          ],
        },
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
  locale: 'it',
  slug: 'case-history-title',
  title: 'Case History Title',
  description: 'Case history description',
  updatedAt: '2024-01-02T00:00:00.000Z',
  image: mediaJpeg().attributes,
  products: [
    {
      name: product.name,
      slug: product.slug,
      logo: mediaJpeg().attributes,
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
