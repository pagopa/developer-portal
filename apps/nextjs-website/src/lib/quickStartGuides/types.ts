import type { Part } from '@/lib/parts/types';

export type Step = {
  readonly title: string;
  readonly anchor: string;
  readonly parts: ReadonlyArray<Part>;
};
