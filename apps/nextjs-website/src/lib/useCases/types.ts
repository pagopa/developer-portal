import type { Path } from '@/lib/paths/types';
import type { Part } from '@/lib/parts/types';
import type { SEO } from '@/lib/seo/types';
import type { Tag } from '@/lib/tags/types';

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
  readonly subtitle?: string;
  readonly tags?: readonly Tag[];
  readonly title: string;
  readonly updatedAt?: string;
} & Path;
