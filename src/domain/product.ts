import { Image } from './Image';

type Product = {
  name: string;
};

export type ProductPageType =
  | 'overview'
  | 'quickstart'
  | 'tutorial'
  | 'api'
  | 'guide';

export type ProductPagePreview = {
  type: ProductPageType;
  title: string;
  description: string;
  link: string;
};

export type ProductPageReferences = {
  title: string;
  references: ReadonlyArray<ProductPagePreview>;
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

// Quickstart /////////////////////////////////////////////////////////////////

type ProductQuickStartPreviewStep = {
  title: string;
  description: string;
};

export type ProductQuickStartPreview = {
  title: string;
  description: string;
  steps: ReadonlyArray<ProductQuickStartPreviewStep>;
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
  tutorial: ProductTutorialReference;
};

export type ProductTutorialReference = ProductPagePreview & {
  date: string;
  image: Image;
};
