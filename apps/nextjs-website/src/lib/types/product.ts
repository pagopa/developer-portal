import { Path } from '@/lib/types/path';
import { Media } from './media';

export type Product = {
  readonly slug: string;
  readonly shortName: string;
  readonly description: string | undefined;
  readonly logo: Media;
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
