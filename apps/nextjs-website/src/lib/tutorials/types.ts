import type { Path } from '@/lib/paths/types';
import type { Part } from '@/lib/parts/types';
import type { SEO } from '@/lib/seo/types';
import type { Tag } from '@/lib/tags/types';
import type { Media } from '@/lib/media/types';

export type Tutorial = {
  readonly showInOverview?: boolean;
  readonly image?: {
    readonly url: string;
    readonly alternativeText?: string;
  };
  readonly description?: string;
  readonly icon?: Media;
  readonly title: string;
  readonly publishedAt?: Date;
  readonly parts?: readonly Part[];
  readonly seo?: SEO;
  readonly tags?: readonly Tag[];
  readonly updatedAt?: string;
  readonly redirectPath?: string;
} & Path;
