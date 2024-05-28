import { Path } from '@/lib/types/path';
import { BlocksContent } from '@strapi/blocks-react-renderer';

export type Tutorial = {
  readonly comingSoon?: boolean;
  readonly showInOverview?: boolean;
  readonly image?: {
    readonly url: string;
    readonly alternativeText: string;
  };
  readonly title: string;
  readonly publishedAt?: Date;
  readonly content?: BlocksContent;
} & Path;
