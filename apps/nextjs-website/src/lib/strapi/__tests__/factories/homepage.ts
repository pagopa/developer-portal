import { strapiHomepage } from '@/lib/strapi/__tests__/fixtures/homepage';
import { StrapiHomepage } from '@/lib/strapi/types/homepage';

export function minimalDataHomepage() {
  return {
    updatedAt: new Date().toISOString(),
    comingsoonDocumentation: {
      title: 'Minimal Documentation',
      links: [],
    },
    heroSlider: [
      {
        title: 'Minimal Hero',
        backgroundImage: undefined,
      },
    ],
    newsShowcase: undefined,
    ecosystem: undefined,
    webinars: [],
    seo: undefined,
  } satisfies StrapiHomepage;
}

export function homepageWithoutNewsShowcase() {
  return {
    ...strapiHomepage,
    newsShowcase: undefined,
  } satisfies StrapiHomepage;
}

export function homepageWithoutEcosystem() {
  return {
    ...strapiHomepage,
    ecosystem: undefined,
  } satisfies StrapiHomepage;
}

export function homepageWithoutWebinars() {
  return {
    ...strapiHomepage,
    webinars: [],
  } satisfies StrapiHomepage;
}

export function homepageWithoutSeo() {
  return {
    ...strapiHomepage,
    seo: undefined,
  } satisfies StrapiHomepage;
}
