import { strapiHomepage } from '@/lib/homepage/__tests__/fixtures';
import { Homepage } from '@/lib/homepage/types';

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
  } satisfies Homepage;
}

export function homepageWithoutNewsShowcase() {
  return {
    ...strapiHomepage,
    newsShowcase: undefined,
  } satisfies Homepage;
}

export function homepageWithoutEcosystem() {
  return {
    ...strapiHomepage,
    ecosystem: undefined,
  } satisfies Homepage;
}

export function homepageWithoutWebinars() {
  return {
    ...strapiHomepage,
    webinars: [],
  } satisfies Homepage;
}

export function homepageWithoutSeo() {
  return {
    ...strapiHomepage,
    seo: undefined,
  } satisfies Homepage;
}
