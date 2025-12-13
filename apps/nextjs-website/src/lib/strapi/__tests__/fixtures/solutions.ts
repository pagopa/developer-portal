import { StrapiSolutions } from '@/lib/strapi/types/solutions';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';

const fixedDateIsoString = new Date('2024-01-01T00:00:00.000Z').toISOString();

export const strapiSolutions = {
  data: [
    {
      id: 1,
      slug: 'solution-title',
      icon: mediaJpeg(),
      kickerTitle: 'Solution Kicker',
      title: 'Solution Title',
      description: 'Solution Description',
      dirName: 'solution-dir',
      landingUseCaseFile: 'use-case.md',
      publishedAt: fixedDateIsoString,
      updatedAt: fixedDateIsoString,
      introductionToSteps: 'Introduction to steps',
      steps: [
        {
          title: 'Step 1',
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Step content' }],
            },
          ],
          products: [
            {
              isVisible: true,
              name: 'Product 1',
              shortName: 'P1',
              slug: 'product-1',
            },
          ],
        },
      ],
      stats: [
        {
          title: 'Stat 1',
          description: 'Stat description',
        },
      ],
      statsSource: 'Stats source',
      bannerLinks: generateBannerLinks(1),
      webinars: [
        {
          id: 1,
          title: 'Webinar Title',
          slug: 'webinar-title',
          description: 'Webinar Description',
          playerSrc: 'https://example.com/player',
          isVisibleInList: true,
          publishedAt: fixedDateIsoString,
          updatedAt: fixedDateIsoString,
          coverImage: mediaJpeg(),
          relatedLinks: {
            title: 'Related Links',
            links: [
              {
                text: 'Link 1',
                href: '/link-1',
              },
            ],
          },
          webinarSpeakers: [],
          webinarCategory: undefined,
          headerImage: undefined,
        },
      ],
      products: [
        {
          isVisible: true,
          name: 'Product 1',
          shortName: 'P1',
          slug: 'product-1',
          description: 'Product description',
          logo: mediaJpeg(),
        },
      ],
      caseHistories: {
        title: 'Case Studies',
        description: 'Success stories',
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
} satisfies StrapiSolutions;

export const expectedSolutionTemplateProps: SolutionTemplateProps = {
  slug: 'solution-title',
  icon: {
    url: 'https://example.com/example.jpg',
    alternativeText: 'Example Image',
    name: 'example.jpg',
    ext: '.jpg',
    mime: 'image/jpeg',
    size: 123456,
  },
  kickerTitle: 'Solution Kicker',
  title: 'Solution Title',
  description: 'Solution Description',
  dirName: 'solution-dir',
  landingUseCaseFile: 'use-case.md',
  introductionToSteps: 'Introduction to steps',
  steps: [
    {
      title: 'Step 1',
      content: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Step content' }],
        },
      ],
      products: [
        {
          shortName: 'P1',
          slug: 'product-1',
        },
      ],
    },
  ],
  stats: [
    {
      title: 'Stat 1',
      description: 'Stat description',
    },
  ],
  statsSource: 'Stats source',
  products: [
    {
      name: 'Product 1',
      slug: 'product-1',
      description: 'Product description',
      logo: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
      },
    },
  ],
  webinars: [
    {
      title: 'Webinar Title',
      slug: 'webinar-title',
      description: 'Webinar Description',
      playerSrc: 'https://example.com/player',
      relatedLinks: {
        title: 'Related Links',
        links: [
          {
            text: 'Link 1',
            href: '/link-1',
          },
        ],
      },
      isVisibleInList: true,
      imagePath: 'https://example.com/example.jpg',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  bannerLinks: [
    {
      title: 'Banner Link 1',
      icon: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
      },
      theme: 'light',
    },
  ],
  successStories: {
    title: 'Case Studies',
    subtitle: 'Success stories',
    stories: [
      {
        title: 'Case History 1',
        path: '/case-histories/case-history-1',
        image: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
      },
    ],
  },
  seo: {
    metaTitle: 'SEO Title',
    metaDescription: 'SEO Description',
  },
  solutionSlug: 'solution-title',
  path: '/solutions/solution-title/details',
  updatedAt: '2024-01-01T00:00:00.000Z',
};
