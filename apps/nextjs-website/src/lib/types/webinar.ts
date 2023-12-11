import { Speaker } from '@/lib/types/speaker';
import { Path } from './path';

export type Webinar = {
  readonly description: string;
  readonly html?: string;
  readonly playerSrc?: string;
  readonly speakers: readonly Speaker[];
  readonly startDateTime?: string;
  readonly endDateTime?: string;
  readonly title: string;
  readonly slug: string;
  readonly relatedLinks?: readonly Path[];
  readonly subscribeCtaLabel?: string;
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
