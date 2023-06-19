import { Page } from '@/pages/api/types/page';

export type PageOverview = Page<{
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
  };
}>;
