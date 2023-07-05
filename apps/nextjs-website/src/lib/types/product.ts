import { Path } from '@/lib/types/path';

export type Product = {
  readonly description: string;
  readonly svgPath: string;
  readonly subpaths: {
    readonly overview: Path;
    readonly quickStart?: Path;
    readonly guides?: Path;
    readonly api?: Path;
    readonly tutorial?: Path;
  };
} & Path;
