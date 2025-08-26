import { BaseSolutionWithProducts } from '@/lib/strapi/types/solutions';
import { CaseHistoriesComponent } from '@/lib/strapi/types/caseHistoriesComponent';
import { StrapiSeo } from '@/lib/strapi/types/seo';
import { Features } from '@/lib/strapi/types/features';

export type SolutionListPage = {
  readonly data: {
    readonly attributes: {
      readonly title: string;
      readonly description: string;
      readonly caseHistories?: CaseHistoriesComponent;
      readonly solutions: {
        readonly data: readonly BaseSolutionWithProducts[];
      };
      readonly features?: Features;
      readonly seo?: StrapiSeo;
    };
  };
};

export type StrapiSolutionListPage = SolutionListPage;
