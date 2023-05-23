import {
  GuidePreviewBlock,
  GuidesCollectionBlock,
} from 'core/domain/pageBlock';
import { Image } from 'core/domain/Image';
import { Product, ProductPage } from 'core/domain/productPage';

const ioAppProduct: Product = {
  name: 'App IO',
  slug: 'app-io',
};

const image: Image = {
  src: 'https://images.pexels.com/photos/175045/pexels-photo-175045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  alt: 'Immagine di IO',
};

const integrationTechGuide: GuidePreviewBlock = {
  type: 'guide-preview',
  title: "Guida tecnica all'integrazione dei servizi",
  preview: {
    title: 'Argomenti trattati',
    description: [
      'Come creare un servizio',
      'Come inviare un messaggio',
      'Come aggiungere allegati',
    ],
    link: '#',
    image,
  },
};

const servicesManual: GuidePreviewBlock = {
  type: 'guide-preview',
  title: "Il manuale dei servizi dell'app IO",
  preview: {
    title: 'Argomenti trattati',
    description: [
      'Chiarire cosa si intende per servizio nel contesto di IO',
      'Spiegare quali sono le tipologie di servizio si possono erogare in IO e quali funzionalità si possono sfruttare',
      'Dare indicazioni su come creare i servizi',
      'Fornire modelli di servizi da poter utilizzare',
    ],
    link: '#',
    image,
  },
};

const cgn: GuidePreviewBlock = {
  type: 'guide-preview',
  title: 'Carta Giovani Nazionale',
  preview: {
    title: 'Argomenti trattati',
    description: [
      'I processi di adesione e attuazione della convenzione al Programma attraverso il Portale dedicato',
    ],
    link: '#',
    image,
  },
};

const integrationCategory: GuidesCollectionBlock['category'] = {
  id: 'integration-category',
  title: "Per l'integrazione",
};

const integrationGuides: GuidesCollectionBlock = {
  type: 'guide-collection',
  category: integrationCategory,
  guides: [integrationTechGuide, servicesManual, cgn],
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
        'Per una conoscenza ancora più approfondita, consulta i manuale e le guide disponibili per l’app IO.',
    },
    integrationGuides,
  ],
};

export const ioAppPageLinks = {
  guides: `/${ioAppProduct.slug}/${ioAppGuideIndex.slug}`,
};
