import { BlocksContent } from '@strapi/blocks-react-renderer';
import type { SEO } from '../seo/types';
import type { Media } from '@/lib/media/types';
import type { Tag } from '@/lib/tags/types';

export type QuestionsAndAnswer = {
  readonly question: string;
  readonly answer: BlocksContent;
};

export type Chapter = {
  readonly slug: string;
  readonly title: string;
  readonly startTime: string;
  readonly endTime: string;
};

export type Webinar = {
  readonly description: string;
  readonly bodyContent?: BlocksContent;
  readonly playerSrc?: string;
  readonly playerCoverImageUrl?: string;
  readonly videoOnDemandStartAt?: number;
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
  readonly tag?: Tag;
  readonly headerImage?: Media;
  readonly updatedAt: string;
  readonly chapters?: readonly Chapter[];
  readonly webvttContent?: string;
};

export type Speaker = {
  readonly name: string;
  readonly jobTitle: string;
  readonly description?: BlocksContent;
  readonly avatar?: Media;
};
