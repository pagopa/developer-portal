import { StrapiConfigType } from "@/lib/strapi/StrapiConfig";

// This type represents the environment of Strapi.
export type StrapiEnv = {
  readonly config: StrapiConfigType;
  readonly fetchFun: typeof fetch;
};
