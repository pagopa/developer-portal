import { Speaker } from '@/lib/types/speaker';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import { Media } from '../strapi/codecs/MediaCodec';

export type QuestionsAndAnswersItem = {
  readonly question: string;
  readonly answer: BlocksContent;
};

export type QuestionsAndAnswer = {
  readonly question: string;
  readonly answer: BlocksContent;
};

export type Webinar = {
  readonly description: string;
  // Use bodyContent instead, remove when webinars will be managed by Strapi
  // (remove it when both of this tasks
  // https://pagopa.atlassian.net/browse/DEV-1557 and
  // https://pagopa.atlassian.net/browse/DEV-1524 are resolved)
  /** @deprecated */
  readonly html?: string;
  readonly bodyContent?: BlocksContent;
  readonly playerSrc?: string;
  readonly speakers: readonly Speaker[];
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
    readonly title: string;
    readonly links: readonly {
      readonly text: string;
      readonly href: string;
    }[];
  };
  readonly subscribeCtaLabel?: string;
  readonly isVisibleInList: boolean;
  readonly imagePath: string;
  readonly startInfo?: {
    readonly title: string;
    readonly cards: readonly {
      readonly comingSoon?: boolean;
      readonly title: string;
      readonly text: string;
      readonly href?: string;
      readonly iconName: string;
    }[];
  };
  readonly questionsAndAnswers?: readonly QuestionsAndAnswer[];
};
