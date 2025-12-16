import { StrapiHomepage } from '@/lib/strapi/types/homepage';
import { HomepageProps } from '@/app/page';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { newsShowcase } from '@/lib/strapi/__tests__/fixtures/newsShowcase';

const fixedDateIsoString = new Date('2024-01-01T00:00:00.000Z').toISOString();

export const strapiHomepage: StrapiHomepage = {
  data: {
    attributes: {
      updatedAt: fixedDateIsoString,
      comingsoonDocumentation: {
        title: 'Coming Soon Documentation',
        links: [
          {
            text: 'Documentation Link',
            href: '/docs',
          },
        ],
      },
      heroSlider: [
        {
          title: 'Hero Title',
          subhead: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Hero subhead content' }],
            },
          ],
          subheadColor: 'main',
          titleColor: 'contrastText',
          callToAction: {
            link: {
              text: 'Get Started',
              href: '/get-started',
            },
            variant: 'contained',
          },
          backgroundImage: {
            data: mediaJpeg(),
          },
        },
      ],
      newsShowcase: {
        ...newsShowcase,
        items: {
          data: newsShowcase.items.data.map((item) => ({
            ...item,
            attributes: {
              ...item.attributes,
              publishedAt: fixedDateIsoString,
              link: item.attributes.link
                ? {
                    ...item.attributes.link,
                    target: item.attributes.link.target || undefined,
                  }
                : item.attributes.link,
            },
          })),
        },
      },
      ecosystem: {
        title: 'Our Ecosystem',
        productsTabName: 'Products',
        products: {
          data: [
            {
              attributes: {
                isVisible: true,
                tags: { data: [] },
                name: 'Product 1',
                shortName: 'P1',
                slug: 'product-1',
                description: 'Product 1 description',
                logo: { data: mediaJpeg() },
                bannerLinks: [],
                overview: { data: { id: 1 } },
                quickstart_guide: { data: { id: 1 } },
                api_data_list_page: { data: undefined },
                tutorial_list_page: { data: { id: 1 } },
                guide_list_page: { data: { id: 1 } },
                release_note: { data: { id: 1 } },
                use_case_list_page: { data: { id: 1 } },
              },
            },
          ],
        },
        solutionsTabName: 'Solutions',
        solutions: {
          data: [
            {
              attributes: {
                slug: 'solution-1',
                icon: { data: mediaJpeg() },
                kickerTitle: 'Solution Kicker',
                title: 'Solution 1',
                description: 'Solution 1 description',
                dirName: 'solution-1-dir',
                landingUseCaseFile: 'use-case.md',
              },
            },
          ],
        },
        solutionsCta: {
          link: {
            text: 'View All Solutions',
            href: '/solutions',
          },
          variant: 'outlined',
        },
      },
      webinars: {
        data: [
          {
            id: 1,
            attributes: {
              title: 'Webinar Title',
              slug: 'webinar-title',
              description: 'Webinar Description',
              playerSrc: 'https://example.com/player',
              isVisibleInList: true,
              publishedAt: fixedDateIsoString,
              updatedAt: fixedDateIsoString,
              coverImage: { data: mediaJpeg() },
              relatedLinks: {
                title: 'Related Links',
                links: [
                  {
                    text: 'Link 1',
                    href: '/link-1',
                  },
                ],
              },
              webinarSpeakers: { data: [] },
              webinarCategory: {
                data: undefined,
              },
              headerImage: {
                data: undefined,
              },
            },
          },
        ],
      },
      seo: {
        metaTitle: 'Homepage SEO Title',
        metaDescription: 'Homepage SEO Description',
      },
    },
  },
};

export const expectedHomepageProps: HomepageProps = {
  updatedAt: fixedDateIsoString,
  comingsoonDocumentation: {
    title: 'Coming Soon Documentation',
    links: [
      {
        text: 'Documentation Link',
        href: '/docs',
      },
    ],
  },
  hero: [
    {
      title: 'Hero Title',
      subhead: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Hero subhead content' }],
        },
      ],
      subheadColor: 'main',
      titleColor: 'contrastText',
      callToAction: {
        link: {
          text: 'Get Started',
          href: '/get-started',
        },
        variant: 'contained',
      },
      backgroundImage: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
      },
    },
  ],
  newsShowcase: {
    title: "Cosa c'è di nuovo",
    items: [
      {
        title:
          "Usa il validatore di SEND per fare una verifica sull'integrazione",
        comingSoon: false,
        publishedAt: new Date('2024-01-01T00:00:00.000Z'),
        label: 'Label',
        link: {
          text: 'Vai al validatore',
          url: '/send/guides/validatore',
          target: '_self',
        },
        image: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
      },
      {
        title:
          "Scopri la Quick Start di piattaforma pagoPA: l'integrazione in pochi semplici step",
        comingSoon: false,
        publishedAt: new Date('2024-01-01T00:00:00.000Z'),
        label: 'Label',
        link: {
          text: 'Vai alla guida',
          url: '/pago-pa/quick-start',
          target: '_self',
        },
        image: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
      },
      {
        title: 'Scopri i nuovi tutorial di Firma con IO',
        comingSoon: false,
        publishedAt: new Date('2024-01-01T00:00:00.000Z'),
        label: 'Label',
        link: {
          text: 'Vai ai tutorial',
          url: '/firma-con-io/tutorials',
          target: '_self',
        },
        image: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
        },
      },
    ],
  },
  ecosystem: {
    title: 'Our Ecosystem',
    productsTabName: 'Products',
    products: [
      {
        title: 'Product 1',
        text: 'Product 1 description',
        href: 'product-1/overview',
        icon: 'https://example.com/example.jpg',
        useSrc: true,
      },
    ],
    solutionsTabName: 'Solutions',
    solutions: [
      {
        title: 'Solution 1',
        text: 'Solution 1 description',
        href: '/solutions/solution-1',
        icon: 'https://example.com/example.jpg',
        useSrc: true,
      },
    ],
    solutionsCta: {
      variant: 'outlined',
      link: {
        text: 'View All Solutions',
        href: '/solutions',
      },
    },
  },
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
  seo: {
    metaTitle: 'Homepage SEO Title',
    metaDescription: 'Homepage SEO Description',
  },
};
