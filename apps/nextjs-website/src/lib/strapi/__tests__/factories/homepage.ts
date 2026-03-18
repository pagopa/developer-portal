import { strapiHomepage } from '@/lib/strapi/__tests__/fixtures/homepage';
import { StrapiHomepage } from '@/lib/strapi/types/homepage';
import { wrapAsRootEntity } from '@/lib/strapi/__tests__/strapiEntityWrappers';

export function minimalDataHomepage() {
  return wrapAsRootEntity({
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
  } satisfies StrapiHomepage);
}

export function homepageWithoutNewsShowcase() {
  return wrapAsRootEntity({
    ...strapiHomepage,
    newsShowcase: undefined,
  } satisfies StrapiHomepage);
}

export function homepageWithoutEcosystem() {
  return wrapAsRootEntity({
    ...strapiHomepage,
    ecosystem: undefined,
  } satisfies StrapiHomepage);
}

export function homepageWithoutWebinars() {
  return wrapAsRootEntity({
    ...strapiHomepage,
    webinars: [],
  } satisfies StrapiHomepage);
}

export function homepageWithoutSeo() {
  return wrapAsRootEntity({
    ...strapiHomepage,
    seo: undefined,
  } satisfies StrapiHomepage);
}
