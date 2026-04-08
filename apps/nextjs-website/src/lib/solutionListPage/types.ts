import { CaseHistoriesComponent } from '@/lib/caseHistories/types';
import { StrapiBaseSolutionWithProducts } from '@/lib/solutions/types';
import { StrapiFeatures } from '@/lib/strapi/types/features';
import type { StrapiSeo } from '@/lib/seo/strapiTypes';

export type StrapiSolutionListPage = {
  readonly title: string;
  readonly description: string;
  readonly caseHistories?: CaseHistoriesComponent;
  readonly solutions: readonly StrapiBaseSolutionWithProducts[];
  readonly features?: StrapiFeatures;
  readonly seo?: StrapiSeo;
};
