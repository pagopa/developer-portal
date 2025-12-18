import { strapiHomepage } from '@/lib/strapi/__tests__/fixtures/homepage';
import { StrapiHomepage } from '@/lib/strapi/types/homepage';

export function minimalDataHomepage() {
  return {
    data: {
      attributes: {
        updatedAt: Date.now().toString(),
        comingsoonDocumentation: {
          title: 'Minimal Documentation',
          links: [],
        },
        heroSlider: [
          {
            title: 'Minimal Hero',
            backgroundImage: { data: undefined },
          },
        ],
        newsShowcase: undefined,
        ecosystem: undefined,
        webinars: { data: [] },
        seo: undefined,
      },
    },
  } satisfies StrapiHomepage;
}

export function homepageWithoutNewsShowcase() {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      attributes: {
        ...strapiHomepage.data.attributes,
        newsShowcase: undefined,
      },
    },
  } satisfies StrapiHomepage;
}

export function homepageWithoutEcosystem() {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      attributes: {
        ...strapiHomepage.data.attributes,
        ecosystem: undefined,
      },
    },
  } satisfies StrapiHomepage;
}

export function homepageWithoutWebinars() {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      attributes: {
        ...strapiHomepage.data.attributes,
        webinars: {
          data: [],
        },
      },
    },
  } satisfies StrapiHomepage;
}

export function homepageWithoutSeo() {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      attributes: {
        ...strapiHomepage.data.attributes,
        seo: undefined,
      },
    },
  } satisfies StrapiHomepage;
}
