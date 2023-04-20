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
  body: '---\ndescription: >-\n  Questo documento è una guida tecnica all\'utilizzo delle API di IO e\n  all’integrazione dei servizi pubblici.\n---\n\n# Guida tecnica\n\n### Primi passi\n\n{% content-ref url="../setup-iniziale" %}\n[setup-iniziale](../setup-iniziale)\n{% endcontent-ref %}\n\n### Funzionalità\n\n{% content-ref url="../funzionalita/pubblicare-un-servizio" %}\n[pubblicare-un-servizio](../funzionalita/pubblicare-un-servizio)\n{% endcontent-ref %}\n\n{% content-ref url="../funzionalita/inviare-un-messaggio" %}\n[inviare-un-messaggio](../funzionalita/inviare-un-messaggio)\n{% endcontent-ref %}\n\n{% content-ref url="../funzionalita/inviare-un-messaggio/aggiungere-allegati-premium" %}\n[aggiungere-allegati-premium](../funzionalita/inviare-un-messaggio/aggiungere-allegati-premium)\n{% endcontent-ref %}\n\n### API\n\n{% content-ref url="../api" %}\n[api](../api)\n{% endcontent-ref %}\n\n### Abilitazioni\n\n{% content-ref url="../abilitazioni" %}\n[abilitazioni](../abilitazioni)\n{% endcontent-ref %}\n\n### Risorse utili\n\n[**Specifiche API ->** ](https://developer.io.italia.it/openapi.html)\n\n[**Domande Frequenti ->**](../risorse-utili/domande-frequenti)\n\n[**Glossario ->**](../risorse-utili/glossario)\n',
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
