import { buildEnv } from '@/lib/buildEnv';
import { fetchQualtrics } from './fetcher';
import * as E from 'fp-ts/lib/Either';

export const QualtricsRepository = {
  getProductGuideSurveyUrl: async (
    locale: string
  ): Promise<string | undefined> => {
    const { data } = await fetchQualtrics(locale, buildEnv);
    const surveyUrl = data?.productGuideSurveyUrl?.trim();
    if (!surveyUrl) return undefined;
    const parsedUrl = E.tryCatch(() => new URL(surveyUrl), E.toError);
    if (E.isLeft(parsedUrl) || parsedUrl.right.protocol !== 'https:') {
      return undefined;
    }

    return surveyUrl;
  },
};
