import { Path } from '@/pages/api/types/path';
import { PageOverview } from '@/pages/api/types/pageOverview';

export type Product = {
  readonly pages: readonly PageOverview[];
} & Path;
