import { PartData } from '@/lib/types/part';

export type Step = {
  readonly title: string;
  readonly anchor: string;
  readonly parts: ReadonlyArray<PartData>;
};
