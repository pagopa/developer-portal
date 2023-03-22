import { Image } from './Image';

export type Product = {
  name: string;
  rootPath: string;
};

export type ProductPageType =
  | 'overview'
  | 'quickstart'
  | 'tutorial'
  | 'api'
  | 'guide';

export type ProductPageReference = {
  type: ProductPageType;
  title: string;
  description: string;
  link: string;
};

export type ProductPageReferences = {
  title: string;
  references: ReadonlyArray<ProductPageReference>;
};

type ProductNavigationItem = {
  label: string;
  path: string;
};

export type ProductNavigation = ReadonlyArray<ProductNavigationItem>;

// Overview ///////////////////////////////////////////////////////////////////

type ProductHero = {
  title: string;
  description: string;
  cover: string;
};

export type ProductOverview = {
  product: Product;
  hero: ProductHero;
  quickStart: ProductQuickStartPreview;
  tutorial: ProductTutorialPreview;
};

export type ProductOverviewPreview = {
  title: string;
  preview: {
    title: string;
    description: string;
    link: string;
    image: Image;
  };
};

// Quickstart /////////////////////////////////////////////////////////////////

type ProductQuickStartPreviewStep = {
  title: string;
  description: string;
};

export type ProductQuickStartPreview = {
  title: string;
  description: string;
  steps: ReadonlyArray<ProductQuickStartPreviewStep>;
  link: string;
};

export type ProductQuickStartElement =
  | {
      type: 'paragraph' | 'inline-code';
      text: string;
    }
  | {
      type: 'code-block';
      text: string;
      title: string;
    };

type ProductQuickStartField = {
  description: string;
  value: string;
};

export type ProductQuickStartExample = {
  title: string;
  fields: ReadonlyArray<ProductQuickStartField>;
  // TODO enforce a Json type
  request: {
    title: string;
    body: string;
  };
};

export type ProductQuickStartStep = {
  title: string;
  description: ReadonlyArray<ProductQuickStartElement>;
  example?: ProductQuickStartExample;
};

export type ProductQuickStart = {
  product: Product;
  title: string;
  description: string;
  steps: ReadonlyArray<ProductQuickStartStep>;
  related: ProductPageReferences;
};

// Tutorial ///////////////////////////////////////////////////////////////////

export type ProductTutorialPreview = {
  title: string;
  preview: {
    title: string;
    description: string;
    link: string;
    image: Image;
    date: string;
  };
};
