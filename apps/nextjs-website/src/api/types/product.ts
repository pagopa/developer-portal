import { Path } from '@/api/types/path';

export type Product = {
  readonly paths: readonly Path[];
} & Path;
