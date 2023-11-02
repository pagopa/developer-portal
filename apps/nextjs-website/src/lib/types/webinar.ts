import { Speaker } from '@/lib/types/speaker';
import { Path } from './path';

export type Webinar = {
  readonly description: string;
  readonly speakers?: readonly Speaker[];
  readonly startDateTime?: Date;
  readonly endDateTime?: Date;
  readonly title: string;
  readonly slug: string;
  readonly relatedLinks?: readonly Path[];
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
