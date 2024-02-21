import { Path } from '@/lib/types/path';

export type Tutorial = {
  readonly comingSoon?: boolean;
  readonly showInOverview?: boolean;
  readonly image: {
    readonly url: string;
    readonly alternativeText: string;
  };
  readonly title: string;
  readonly publishedAt?: string;
} & Path;
