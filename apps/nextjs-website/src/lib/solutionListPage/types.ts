import { CaseHistoriesComponent } from '@/lib/caseHistories/types';
import { StrapiFeatures } from '@/lib/strapi/types/features';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiBaseSolutionWithProducts } from '@/lib/strapi/types/solutions';

export type StrapiSolutionListPage = {
  readonly title: string;
  readonly description: string;
  readonly caseHistories?: CaseHistoriesComponent;
  readonly solutions: readonly StrapiBaseSolutionWithProducts[];
  readonly features?: StrapiFeatures;
  readonly seo?: StrapiSeo;
};
