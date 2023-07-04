import { Path } from '@/lib/types/path';

export type Guide = {
  readonly title: string;
  readonly description: string;
} & Path;
