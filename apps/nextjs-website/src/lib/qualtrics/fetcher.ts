import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import type { RootEntity } from '@/lib/strapi/types/rootEntity';

type QualtricsConfig = {
  readonly productGuideSurveyUrl?: string;
};

export const fetchQualtrics = fetchFromStrapi<
  RootEntity<QualtricsConfig | undefined>
>('qualtrics', qs.stringify({ fields: ['productGuideSurveyUrl'] }));
