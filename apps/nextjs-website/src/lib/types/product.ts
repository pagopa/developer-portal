import { Path } from '@/lib/types/path';

export type Product = {
  readonly description: string;
  readonly svgPath: string;
  readonly subpaths: {
    readonly api?: Path;
    readonly guides?: Path;
    readonly overview: Path;
    readonly quickStart?: Path;
    readonly tutorials?: Path;
  };
} & Path;
