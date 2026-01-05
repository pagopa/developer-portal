import { Path } from '@/lib/types/path';
import { Part } from '@/lib/types/part';
import { SEO } from '@/lib/types/seo';
import { Tag } from '@/lib/types/tag';

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
  readonly localizations?: ReadonlyArray<{
    readonly locale: string;
    readonly slug: string;
  }>;
  readonly locale: string;
} & Path;
