import { StrapiBaseCaseHistory } from '@/lib/strapi/types/caseHistories';

export type StrapiCaseHistoriesComponent = {
  readonly title: string;
  readonly description?: string;
  readonly case_histories: readonly StrapiBaseCaseHistory[];
};
