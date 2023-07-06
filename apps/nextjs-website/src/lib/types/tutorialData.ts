import { Path } from '@/lib/types/path';

export type Tutorial = {
  readonly coomingsoon?: boolean;
  readonly image?: {
    readonly url: string;
    readonly alt: string;
  };
  readonly title: string;
  readonly dateString: string;
} & Path;
