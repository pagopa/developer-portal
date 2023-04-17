import { ProductGuidePage } from '@/domain/productGuidePage';
import { Product } from '@/domain/productPage';

const ioAppProduct: Product = {
  name: 'App IO',
  slug: 'app-io',
};

export const ioAppGuideTechGuideV23Home: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'per-iniziare',
  title: 'Per Iniziare',
  body: 'Hello, start here',
  kind: 'page',
  children: [],
};
export const ioAppGuideTechGuideV23Changelog: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'changelog',
  title: 'Changelog',
  body: 'version 1',
  kind: 'page',
  children: [],
};

export const ioAppGuideTechGuideV23CreateService: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'creare-un-servizio',
  title: 'Creare un servizio',
  body: 'some content that should say how to create a service',
  kind: 'page',
  children: [],
};

export const ioAppGuideTechGuideV23PublishService: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'pubblicare-un-servizio',
  title: 'Pubblicare un servizio',
  body: 'some content that should say how to publish a service',
  kind: 'page',
  children: [ioAppGuideTechGuideV23CreateService],
};

export const ioAppGuideTechGuideV23Functionalities: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'funzionalita',
  title: 'Funzionalità',
  body: '',
  kind: 'group',
  children: [ioAppGuideTechGuideV23PublishService],
};

export const ioAppGuideTechGuideV23Adesione: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'adesione-tramite-larea-riservata',
  title: "Adesione tramite l'Area Riservata",
  body: '',
  kind: 'page',
  children: [],
};

export const ioAppGuideTechGuideV23SetUp: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'setup-iniziale',
  title: 'Setup iniziale',
  body: '',
  kind: 'page',
  children: [ioAppGuideTechGuideV23Adesione],
};

export const ioAppPageLinks = {
  guide: `/${ioAppProduct.slug}/guide-manuali/`,
  guideTechGuideV23Home: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Home.guideSlug}/${ioAppGuideTechGuideV23Home.versionSlug}/${ioAppGuideTechGuideV23Home.slug}`,
  guideTechGuideV23Changelog: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Changelog.guideSlug}/${ioAppGuideTechGuideV23Changelog.versionSlug}/${ioAppGuideTechGuideV23Changelog.slug}`,
  ioAppGuideTechGuideV23Functionalities: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Functionalities.guideSlug}/${ioAppGuideTechGuideV23Functionalities.versionSlug}/${ioAppGuideTechGuideV23Functionalities.slug}`,
};
