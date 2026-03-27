import { BuildConfig } from '@/buildConfig';
import { StrapiEnv } from '@/lib/strapi/strapiEnv';

// BuildEnv
export type BuildEnv = {
  readonly config: BuildConfig;
} & StrapiEnv;

// given environment variables produce an BuildEnv
export const makeBuildEnv = (config: BuildConfig): BuildEnv => ({
  config,
  fetchFun: fetch,
});
