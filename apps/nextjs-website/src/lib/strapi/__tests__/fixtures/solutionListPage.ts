import { StrapiSolutionListPage } from '@/lib/strapi/types/solutionListPage';
import { SolutionListTemplateProps } from '@/components/templates/SolutionListTemplate/SolutionListTemplate';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';

const fixedDateIsoString = new Date('2025-01-01T00:00:00.000Z').toISOString();

export const strapiSolutionListPage = {
  title: 'Solutions',
  description: 'Explore our solutions',
  solutions: [
    {
      slug: 'solution-1',
      icon: mediaJpeg(),
      kickerTitle: 'Solution Kicker 1',
      title: 'Solution 1',
      description: 'Solution 1 Description',
      dirName: 'solution-1-dir',
      landingUseCaseFile: 'use-case-1.md',
      products: [
        {
          isVisible: true,
          name: 'Product 1',
          shortName: 'P1',
          slug: 'product-1',
          description: 'Product 1 description',
          logo: mediaJpeg(),
        },
      ],
    },
  ],
  caseHistories: {
    title: 'Success Stories',
    description: 'Our case studies',
    case_histories: [
      {
        id: 1,
        slug: 'case-history-1',
        title: 'Case History 1',
        description: 'Case history description',
        publishedAt: fixedDateIsoString,
        updatedAt: fixedDateIsoString,
        image: mediaJpeg(),
      },
    ],
  },
  features: {
    title: 'Features',
    subtitle: 'Our key features',
    items: generateBannerLinks(2),
  },
  seo: {
    metaTitle: 'Solutions SEO Title',
    metaDescription: 'Solutions SEO Description',
  },
} satisfies StrapiSolutionListPage;

export const expectedSolutionListTemplateProps: SolutionListTemplateProps = {
  hero: {
    title: 'Solutions',
    subtitle: 'Explore our solutions',
  },
  solutions: [
    {
      name: 'Solution 1',
      description: 'Solution 1 Description',
      logo: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
      },
      slug: 'solutions/solution-1',
      labels: [
        {
          label: 'P1',
          path: '/product-1',
        },
      ],
    },
  ],
  successStories: {
    title: 'Success Stories',
    subtitle: 'Our case studies',
    stories: [
      {
        title: 'Case History 1',
        path: 'case-histories/case-history-1',
        image: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
      },
    ],
  },
  features: {
    title: 'Features',
    items: [
      {
        title: 'Banner Link 1',
        content: undefined,
        iconUrl: 'https://example.com/example.jpg',
      },
      {
        title: 'Banner Link 2',
        content: undefined,
        iconUrl: 'https://example.com/example.jpg',
      },
    ],
  },
  seo: {
    metaTitle: 'Solutions SEO Title',
    metaDescription: 'Solutions SEO Description',
  },
};
