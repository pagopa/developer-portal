import { buildEnv } from '@/lib/buildEnv';
import { TutorialsPageProps } from '@/app/[locale]/[productSlug]/tutorials/page';
import { fetchTutorialListPages } from './fetcher';
import { mapTutorialListPageProps } from './mapper';

export const TutorialListPageRepository = {
  getAll: async (locale: string): Promise<readonly TutorialsPageProps[]> => {
    const strapiTutorialListPages = await fetchTutorialListPages(
      locale,
      buildEnv
    );

    return mapTutorialListPageProps(locale, strapiTutorialListPages);
  },

  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<TutorialsPageProps | undefined> => {
    const all = await TutorialListPageRepository.getAll(locale);
    return all.find(
      (tutorialListPage) => tutorialListPage.product.slug === productSlug
    );
  },
};
