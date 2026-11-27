import { buildEnv } from '@/lib/buildEnv';
import { fetchQualtrics } from './fetcher';

export const QualtricsRepository = {
  getProductGuideSurveyUrl: async (
    locale: string
  ): Promise<string | undefined> => {
    const { data } = await fetchQualtrics(locale, buildEnv);
    return data?.productGuideSurveyUrl?.trim() || undefined;
  },
};
