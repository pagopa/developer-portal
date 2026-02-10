import { StrapiBaseSolutionWithProducts } from '@/lib/strapi/types/solutions';
import { StrapiCaseHistoriesComponent } from '@/lib/strapi/types/caseHistoriesComponent';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { StrapiFeatures } from '@/lib/strapi/types/features';

export type StrapiSolutionListPage = {
  readonly data: {
    readonly attributes: {
      readonly title: string;
      readonly description: string;
      readonly caseHistories?: StrapiCaseHistoriesComponent;
      readonly solutions: {
        readonly data: readonly StrapiBaseSolutionWithProducts[];
      };
      readonly features?: StrapiFeatures;
      readonly seo?: StrapiSeo;
    };
  };
};
