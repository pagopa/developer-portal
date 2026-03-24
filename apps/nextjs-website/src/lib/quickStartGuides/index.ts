import { buildEnv } from '@/lib/buildEnv';
import { fetchQuickStartGuides } from './fetcher';
import { mapQuickStartGuidesProps } from './mapper';
import { QuickStartGuidePageProps } from '@/app/[locale]/[productSlug]/quick-start/page';

export const QuickStartGuidesRepository = {
  getAll: async (
    locale: string
  ): Promise<ReadonlyArray<QuickStartGuidePageProps>> => {
    const strapiQuickStartGuides = await fetchQuickStartGuides(
      locale,
      buildEnv
    );
    return mapQuickStartGuidesProps(locale, strapiQuickStartGuides);
  },

  getByProductSlug: async (
    locale: string,
    productSlug: string
  ): Promise<QuickStartGuidePageProps | undefined> => {
    const all = await QuickStartGuidesRepository.getAll(locale);
    return all.find(
      (quickStartGuide) => quickStartGuide.product.slug === productSlug
    );
  },
};
