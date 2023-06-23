import { Path } from '@/lib/types/path';

export type Product = {
  readonly paths: readonly Path[];
} & Path;
