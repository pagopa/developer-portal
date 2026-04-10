import { StrapiConfig } from '@/lib/strapi/strapiConfig';

// This type represents the environment of Strapi.
export type StrapiEnv = {
  readonly config: StrapiConfig;
  readonly fetchFun: typeof fetch;
};
