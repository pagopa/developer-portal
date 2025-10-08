import { Path } from '@/lib/types/path';
import { Part } from './part';
import { SEO } from './seo';

export type UseCase = {
  readonly coverImage?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly headerImage?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly parts?: readonly Part[];
  readonly publishedAt?: Date;
  readonly seo?: SEO;
  readonly showInOverview?: boolean;
  readonly title: string;
  readonly updatedAt?: string;
} & Path;
