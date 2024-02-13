import { BuildConfig } from '@/BuildConfig';
import { StrapiEnv } from '@/lib/strapi/StapiEnv';

// BuildEnv
export type BuildEnv = {
  readonly config: BuildConfig;
} & StrapiEnv;

// given environment variables produce an BuildEnv
export const makeBuildEnv = (config: BuildConfig): BuildEnv => ({
  config,
  fetchFun: fetch,
});
