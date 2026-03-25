import { buildEnv } from '@/lib/buildEnv';
import { UseCasesPageProps } from '@/app/[locale]/[productSlug]/use-cases/page';
import { fetchUseCaseListPages } from './fetcher';
import { mapUseCaseListPageProps } from './mapper';

export const UseCaseListPageRepository = {
  getAll: async (locale: string): Promise<readonly UseCasesPageProps[]> => {
    const strapiUseCaseListPages = await fetchUseCaseListPages(
      locale,
      buildEnv
    );

    return mapUseCaseListPageProps(locale, strapiUseCaseListPages);
  },

  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<UseCasesPageProps | undefined> => {
    const all = await UseCaseListPageRepository.getAll(locale);
    return all.find(
      (useCaseListPage) => useCaseListPage.product.slug === productSlug
    );
  },
};
