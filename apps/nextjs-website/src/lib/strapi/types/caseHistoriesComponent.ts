import { BaseCaseHistory } from '@/lib/strapi/types/caseHistories';

export type CaseHistoriesComponent = {
  readonly title: string;
  readonly description?: string;
  readonly case_histories: {
    readonly data: readonly BaseCaseHistory[];
  };
};
