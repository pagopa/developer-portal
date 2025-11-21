/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-throw-statements */

// In case of an error, the error will be thrown
export async function fetchFromStrapi<T>(
  url: string
): Promise<{ data: T[]; responseJson?: unknown }> {
  const output = await fetchFromStrapiResponse(url);
  console.log(
    `Successfully fetched ${output.data?.length || 0} ${url} from Strapi`
  );
  return { data: output.data || [], responseJson: output };
}

// In case of an error, the error will be thrown
export async function getResponseFromStrapi(url: string) {
  const output = await fetchFromStrapiResponse(url);
  console.log(`Successfully fetched data from Strapi: ${url}`);
  return output;
}

// In case of an error, the error will be thrown
const MISSING_STRAPI_CONFIG_ERROR = 'Missing Strapi configuration in environment variables';

async function fetchFromStrapiResponse(url: string) {
  console.log('Fetching from Strapi...');
  const strapiEndpoint = process.env.STRAPI_ENDPOINT;
  const strapiApiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiEndpoint || !strapiApiToken) {
    console.error(MISSING_STRAPI_CONFIG_ERROR);
    throw new Error(MISSING_STRAPI_CONFIG_ERROR);
  }

  const response = await fetch(`${strapiEndpoint}/${url}`, {
    headers: {
      Authorization: `Bearer ${strapiApiToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}
