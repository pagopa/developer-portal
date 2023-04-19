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
  slug: 'guida-tecnica',
  title: 'Guida tecnica',
  body: 'Hello, start here',
};
export const ioAppGuideTechGuideV23InitialSetup: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'setup-iniziale',
  title: 'Setup iniziale',
  body: 'version 1',
};

export const ioAppGuideTechGuideV23DevPortalSignUp: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'iscrizione-al-developer-portal',
  title: 'Iscrizione al Developer Portal',
  body: 'some content that should say how to create a service',
};

export const ioAppGuideTechGuideV23PublishService: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'pubblicare-un-servizio',
  title: 'Pubblicare un servizio',
  body: 'some content that should say how to publish a service',
};

export const ioAppGuideTechGuideV23CreateService: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'creare-un-servizio',
  title: 'Creare un servizio',
  body: '',
};

export const ioAppPageLinks = {
  guide: `/${ioAppProduct.slug}/guide-manuali/`,
  guideTechGuideV23Home: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Home.guideSlug}/${ioAppGuideTechGuideV23Home.versionSlug}/${ioAppGuideTechGuideV23Home.slug}`,
  guideTechGuideV23InitialSetUp: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23InitialSetup.guideSlug}/${ioAppGuideTechGuideV23InitialSetup.versionSlug}/${ioAppGuideTechGuideV23InitialSetup.slug}`,
  ioAppGuideTechGuideV23CreateService: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23CreateService.guideSlug}/${ioAppGuideTechGuideV23CreateService.versionSlug}/${ioAppGuideTechGuideV23CreateService.slug}`,
  ioAppGuideTechGuideV23DevPortalSignUp: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23DevPortalSignUp.guideSlug}/${ioAppGuideTechGuideV23DevPortalSignUp.versionSlug}/${ioAppGuideTechGuideV23DevPortalSignUp.slug}`,
  ioAppGuideTechGuideV23PublishService: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23PublishService.guideSlug}/${ioAppGuideTechGuideV23PublishService.versionSlug}/${ioAppGuideTechGuideV23PublishService.slug}`,
};
