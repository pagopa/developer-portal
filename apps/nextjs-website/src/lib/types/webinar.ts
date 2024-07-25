import { Speaker } from '@/lib/types/speaker';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type QuestionsAndAnswersItem = {
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
  readonly questionsAndAnswers?: readonly QuestionsAndAnswers[];
};

export type StaticWebinar = Webinar & { readonly isVisibleInHome: boolean };
