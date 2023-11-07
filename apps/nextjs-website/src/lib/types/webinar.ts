import { Speaker } from '@/lib/types/speaker';

export type Webinar = {
  readonly description: string;
  readonly speakers: readonly Speaker[];
  readonly startDateTime?: Date;
  readonly endDateTime?: Date;
  readonly title: string;
  readonly path: string;
};
