import { Path } from '@/lib/types/path';

export type Product = {
  readonly subpaths: {
    readonly overview?: Path;
    readonly quickStart?: Path;
    readonly guides?: Path;
    readonly api?: Path;
  };
} & Path;
