import { Path } from '@/lib/types/path';
import { Part } from './part';
import { SEO } from './seo';

export type UseCase = {
  readonly showInOverview?: boolean;
  readonly image?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly title: string;
  readonly publishedAt?: Date;
  readonly parts?: readonly Part[];
  readonly seo?: SEO;
  readonly updatedAt?: string;
} & Path;
