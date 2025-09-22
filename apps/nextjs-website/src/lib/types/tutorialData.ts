import { Path } from '@/lib/types/path';
import { PartData } from './part';
import { SEO } from './seo';

export type Tutorial = {
  readonly showInOverview?: boolean;
  readonly image?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly title: string;
  readonly publishedAt?: Date;
  readonly parts?: readonly PartData[];
  readonly seo?: SEO;
  readonly updatedAt?: string;
} & Path;
