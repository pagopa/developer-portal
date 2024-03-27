import { Speaker } from '@/lib/types/speaker';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type Webinar = {
  readonly description: string;
  // TODO: this attribute is deprecated use textContent instead, remove when webinars will be managed by Strapi (remove this fallback when both of this tasks https://pagopa.atlassian.net/browse/DEV-1557 and https://pagopa.atlassian.net/browse/DEV-1524 are resolved)
  readonly html?: string;
  readonly textContent?: BlocksContent;
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
  readonly isVisibleInHome: boolean;
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
};
