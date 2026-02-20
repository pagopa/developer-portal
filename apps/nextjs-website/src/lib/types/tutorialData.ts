import { Path } from '@/lib/types/path';
import { Part } from './part';
import { SEO } from './seo';
import { Tag } from '@/lib/types/tag';
import { Media } from '@/lib/types/media';

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
