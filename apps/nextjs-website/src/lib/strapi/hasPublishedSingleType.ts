import type { StrapiEnv } from '@/lib/strapi/strapiEnv';

export const hasPublishedSingleType = async (
  contentType: string,
  locale: string,
  strapiEnv: StrapiEnv
): Promise<boolean> => {
  const response = await strapiEnv.fetchFun(
    `${strapiEnv.config.STRAPI_ENDPOINT}/api/${contentType}?locale=${locale}&fields[0]=updatedAt`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${strapiEnv.config.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    }
  );

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `Failed to fetch ${contentType} locale ${locale}: ${response.status}`
    );
  }

  const result: { readonly data?: unknown } = await response.json();

  return result.data != null;
};
