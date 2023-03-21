import { PageRef } from '@/domain/PageRef';
import { PagePreview } from './PagePreview';

export type RelatedResourcesBlock = {
  title: string;
  previews: ReadonlyArray<PagePreview>;
};

export type IntroBlock = {
  title: string;
  description: string;
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

export type QuickStartField = {
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

export type ProductQuickStartPage = {
  title: string;
  submenu: ReadonlyArray<PageRef>;
  intro: IntroBlock;
  steps: ReadonlyArray<QuickStartStep>;
  related: RelatedResourcesBlock;
};
