import { Image } from './Image';

export type HeroBlock = {
  type: 'hero';
  title: string;
  description: string;
  // change to image
  cover: string;
};

export type HeroInfoBlock = {
  type: 'hero-info';
  title: string;
  description: string;
};

type QuickStartPreviewBlockStep = {
  title: string;
  description: string;
};

export type QuickStartPreviewBlock = {
  type: 'quickstart-preview';
  title: string;
  description: string;
  steps: ReadonlyArray<QuickStartPreviewBlockStep>;
  link: string;
};

export type QuickStartElement =
  | {
      type: 'paragraph' | 'inline-code';
      text: string;
    }
  | {
      type: 'code-block';
      text: string;
      title: string;
    };

type QuickStartField = {
  description: string;
  value: string;
};

export type QuickStartExample = {
  title: string;
  fields: ReadonlyArray<QuickStartField>;
  // TODO enforce a Json type
  request: {
    title: string;
    body: string;
  };
};

export type QuickStartStep = {
  title: string;
  description: ReadonlyArray<QuickStartElement>;
  example?: QuickStartExample;
};

export type QuickStartBlock = {
  type: 'quickstart';
  steps: ReadonlyArray<QuickStartStep>;
};

export type TutorialPreviewBlock = {
  type: 'tutorial-preview';
  title: string;
  preview: {
    title: string;
    description: string;
    link: string;
    image: Image;
    date: string;
  };
};

export type ResourceType =
  | 'overview'
  | 'quickstart'
  | 'tutorial'
  | 'api'
  | 'guide';

type RelatedResource = {
  type: ResourceType;
  title: string;
  description: string;
  link: string;
};

export type RelatedResourcesBlock = {
  type: 'related-resources';
  title: string;
  references: ReadonlyArray<RelatedResource>;
};

export type PageBlock =
  | HeroBlock
  | HeroInfoBlock
  | QuickStartBlock
  | QuickStartPreviewBlock
  | TutorialPreviewBlock
  | RelatedResourcesBlock;
