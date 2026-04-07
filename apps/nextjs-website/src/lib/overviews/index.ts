import { buildEnv } from '@/lib/buildEnv';
import { OverviewPageProps } from '@/app/[locale]/[productSlug]/overview/page';
import { fetchOverviews } from './fetcher';
import { mapOverviewsProps } from './mapper';

export const OverviewsRepository = {
  getAll: async (locale: string): Promise<ReadonlyArray<OverviewPageProps>> => {
    const strapiOverviews = await fetchOverviews(locale, buildEnv);
    return mapOverviewsProps(locale, strapiOverviews);
  },
};
