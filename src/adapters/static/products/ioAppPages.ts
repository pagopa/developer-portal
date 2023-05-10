import { Product, ProductPage } from '@/domain/productPage';
import { ioSignPageLinks } from '@/adapters/static/products/ioSignPages';
import { GuidePreviewBlock, GuideCategoryPreview } from '@/domain/pageBlock';
import { Image } from '@/domain/Image';

const ioAppProduct: Product = {
  name: 'App IO',
  slug: 'app-io',
};

const image: Image = {
  src: 'https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  alt: 'Immagine di Firma con IO',
};

const techGuideIOSign: GuidePreviewBlock = {
  type: 'guide-preview',
  title: 'Guida tecnica IO',
  preview: {
    title: 'Argomenti trattati',
    description: [
      'Setup iniziale: come aderire',
      'Creare e pubblicare un servizio',
      'Inviare un messaggio',
      'Eseguire test sulle funzionalità',
    ],
    link: ioSignPageLinks.overview,
    image,
  },
};
const manual: GuidePreviewBlock = {
  type: 'guide-preview',
  title: 'Manuale dei servizi',
  preview: {
    title: 'Argomenti trattati',
    description: [
      'Setup iniziale: come aderire',
      'Creare e pubblicare un servizio',
      'Inviare un messaggio',
      'Eseguire test sulle funzionalità',
    ],
    link: ioSignPageLinks.overview,
    image,
  },
};
const content: GuidePreviewBlock = {
  type: 'guide-preview',
  title: "Guida di contenuto dell'app IO",
  preview: {
    title: 'Argomenti trattati',
    description: [
      'Setup iniziale: come aderire',
      'Creare e pubblicare un servizio',
      'Inviare un messaggio',
      'Eseguire test sulle funzionalità',
    ],
    link: ioSignPageLinks.overview,
    image,
  },
};

const integrationCategory: GuideCategoryPreview['category'] = {
  id: 'integration-category',
  title: "Per l'integrazione",
};
const usageCategory: GuideCategoryPreview['category'] = {
  id: 'usage-category',
  title: "Per l'utilizzo",
};
const integrationGuides: GuideCategoryPreview = {
  type: 'guide-category-preview',
  category: integrationCategory,
  guides: [techGuideIOSign],
};
const usageGuides: GuideCategoryPreview = {
  type: 'guide-category-preview',
  category: usageCategory,
  guides: [manual, content],
};

export const ioAppGuideIndex: ProductPage = {
  product: ioAppProduct,
  slug: 'guide-manuali',
  title: 'Guide e Manuali',
  blocks: [
    {
      type: 'hero-info',
      title: 'Guide e Manuali',
      description:
        'Learn what content testing is, the methods of testing content available to you, and how to plan and conduct your research.',
    },
    integrationGuides,
    usageGuides,
  ],
};

export const ioAppPageLinks = {
  guides: `/${ioAppProduct.slug}/${ioAppGuideIndex.slug}`,
};
