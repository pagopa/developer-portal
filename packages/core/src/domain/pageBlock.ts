import { Image } from './Image';

export type HeroBlock = {
  readonly type: 'hero';
  readonly title: string;
  readonly description: string;
  // change to image
  readonly cover: string;
};

export type HeroInfoBlock = {
  readonly type: 'hero-info';
  readonly title: string;
  readonly description: string;
};

type QuickStartPreviewBlockStep = {
  readonly title: string;
  readonly description: string;
};

export type QuickStartPreviewBlock = {
  readonly type: 'quickstart-preview';
  readonly title: string;
  readonly description: string;
  readonly steps: ReadonlyArray<QuickStartPreviewBlockStep>;
  readonly link: string;
};

export type QuickStartElement =
  | {
      readonly type: 'paragraph' | 'inline-code';
      readonly text: string;
    }
  | {
      readonly type: 'code-block';
      readonly text: string;
      readonly title: string;
    };

type QuickStartField = {
  readonly description: string;
  readonly value: string;
};

export type QuickStartExample = {
  readonly title: string;
  readonly fields: ReadonlyArray<QuickStartField>;
  // TODO enforce a Json type
  readonly request: {
    readonly title: string;
    readonly body: string;
  };
};

export type QuickStartStep = {
  readonly title: string;
  readonly description: ReadonlyArray<QuickStartElement>;
  readonly example?: QuickStartExample;
};

export type QuickStartBlock = {
  readonly type: 'quickstart';
  readonly steps: ReadonlyArray<QuickStartStep>;
};

export type TutorialPreviewBlock = {
  readonly type: 'tutorial-preview';
  readonly title: string;
  readonly preview: {
    readonly title: string;
    readonly description: string;
    readonly link: string;
    readonly image: Image;
    readonly date: string;
  };
};

export type ResourceType =
  | 'overview'
  | 'quickstart'
  | 'tutorial'
  | 'api'
  | 'guide';

type RelatedResource = {
  readonly type: ResourceType;
  readonly title: string;
  readonly description: string;
  readonly link: string;
};

export type RelatedResourcesBlock = {
  readonly type: 'related-resources';
  readonly title: string;
  readonly references: ReadonlyArray<RelatedResource>;
};

type GuideCategory = {
  readonly id: string;
  readonly title: string;
};

export type GuidePreviewBlock = {
  readonly type: 'guide-preview';
  readonly title: string;
  readonly preview: {
    readonly title: string;
    readonly description: ReadonlyArray<string>;
    readonly link: string;
    readonly image: Image;
  };
};

export type GuidesCollectionBlock = {
  readonly type: 'guide-collection';
  readonly category: GuideCategory;
  readonly guides: ReadonlyArray<GuidePreviewBlock>;
};

export type PageBlock =
  | HeroBlock
  | HeroInfoBlock
  | QuickStartBlock
  | QuickStartPreviewBlock
  | TutorialPreviewBlock
  | RelatedResourcesBlock
  | GuidesCollectionBlock;
