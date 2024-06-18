import { Path } from '@/lib/types/path';

export type Product = {
  readonly slug: string;
  readonly description: string | undefined;
  readonly logo: {
    readonly name: string;
    readonly width: number;
    readonly height: number;
    readonly ext: string;
    readonly mime: string;
    readonly url: string;
  };
  readonly subpaths: Subpaths;
} & Path;

type Subpaths = {
  readonly api?: Path;
  readonly guides?: Path;
  readonly overview: Path;
  readonly quickStart?: Path;
  readonly tutorials?: Path;
};

export type ProductSubpathsKeys = keyof Subpaths;
