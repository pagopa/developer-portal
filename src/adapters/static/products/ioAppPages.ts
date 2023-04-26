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
export const ioAppGuideTechGuideV23Changelog: ProductGuidePage = {
  product: ioAppProduct,
  guideSlug: 'io-guida-tecnica',
  versionSlug: 'v2.3',
  slug: 'changelog',
  title: 'Changelog',
  body: 'version 1',
};

export const ioAppPageLinks = {
  guide: `/${ioAppProduct.slug}/guide-manuali/`,
  guideTechGuideV23Home: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Home.guideSlug}/${ioAppGuideTechGuideV23Home.versionSlug}/${ioAppGuideTechGuideV23Home.slug}`,
  guideTechGuideV23Changelog: `/${ioAppProduct.slug}/guide-manuali/${ioAppGuideTechGuideV23Changelog.guideSlug}/${ioAppGuideTechGuideV23Changelog.versionSlug}/${ioAppGuideTechGuideV23Changelog.slug}`,
};
