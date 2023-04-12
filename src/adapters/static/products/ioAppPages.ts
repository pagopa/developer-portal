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
};
export const ioAppGuideTechGuideV23Changelog: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'changelog',
  title: 'Changelog',
  body: 'version 1',
};

export const ioAppPageLinks = {
  guideTechGuideV23Home: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Home.guideSlug}/${ioAppGuideTechGuideV23Home.versionSlug}/${ioAppGuideTechGuideV23Home.slug}`,
  guideTechGuideV23Changelog: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Changelog.guideSlug}/${ioAppGuideTechGuideV23Changelog.versionSlug}/${ioAppGuideTechGuideV23Changelog.slug}`,
};
