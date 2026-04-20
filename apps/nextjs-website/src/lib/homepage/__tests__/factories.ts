import { strapiHomepage } from '@/lib/homepage/__tests__/fixtures';
import type { StrapiHomepage } from '@/lib/homepage/types';
import { wrapAsRootEntity } from '@/lib/__tests__/strapiEntityWrappers';

export function minimalDataHomepage(): StrapiHomepage {
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
  });
}

export function homepageWithoutNewsShowcase(): StrapiHomepage {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      newsShowcase: undefined,
    },
  };
}

export function homepageWithoutEcosystem(): StrapiHomepage {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      ecosystem: undefined,
    },
  };
}

export function homepageWithoutWebinars(): StrapiHomepage {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      webinars: [],
    },
  };
}

export function homepageWithoutSeo(): StrapiHomepage {
  return {
    ...strapiHomepage,
    data: {
      ...strapiHomepage.data,
      seo: undefined,
    },
  };
}
