import { StrapiBaseSolutionWithProducts } from '@/lib/strapi/types/solutions';
import { CaseHistoriesComponent } from '@/lib/caseHistories/types';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiFeatures } from '@/lib/strapi/types/features';

export type StrapiSolutionListPage = {
  readonly title: string;
  readonly description: string;
  readonly caseHistories?: CaseHistoriesComponent;
  readonly solutions: readonly StrapiBaseSolutionWithProducts[];
  readonly features?: StrapiFeatures;
  readonly seo?: StrapiSeo;
};
