import { Path } from '@/lib/types/path';

export type Product = {
  readonly paths: {
    readonly overview: Path;
    readonly quickStart?: Path;
    readonly guides?: Path;
  };
} & Path;
