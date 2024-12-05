import { Speaker } from '@/lib/types/speaker';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from '../strapi/codecs/MediaCodec';
import { SEO } from './seo';

export type QuestionsAndAnswer = {
  readonly question: string;
  readonly answer: BlocksContent;
};

export type Webinar = {
  readonly description: string;
  readonly bodyContent?: BlocksContent;
  readonly playerSrc?: string;
  readonly speakers?: readonly Speaker[];
  readonly startDateTime?: string;
  readonly endDateTime?: string;
  readonly title: string;
  readonly slug: string;
  readonly relatedResources?: {
    readonly title: string;
    readonly resources: readonly {
      readonly title: string;
      readonly subtitle?: string;
      readonly description?: BlocksContent;
      readonly linkText: string;
      readonly linkHref: string;
      readonly image?: Media;
    }[];
    readonly downloadableDocuments?: readonly {
      readonly title: string;
      readonly downloadLink: string;
      readonly size: number;
      readonly extension: string;
    }[];
  };
  readonly relatedLinks?: {
    readonly title?: string;
    readonly links: readonly {
      readonly text: string;
      readonly href: string;
    }[];
  };
  readonly subscribeCtaLabel?: string;
  readonly isVisibleInList: boolean;
  readonly imagePath: string;
  readonly questionsAndAnswers?: readonly QuestionsAndAnswer[];
  readonly seo?: SEO;
};
