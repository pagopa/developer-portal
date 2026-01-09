/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-throw-statements */

// In case of an error, the error will be thrown
export async function fetchFromStrapi<T>(
  url: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: T[]; responseJson?: any }> {
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
async function fetchFromStrapiResponse(url: string) {
  console.log('Fetching solutions from Strapi...');
  const strapiEndpoint = process.env.STRAPI_ENDPOINT;
  const strapiApiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiEndpoint || !strapiApiToken) {
    console.error('Missing Strapi configuration in environment variables');
    throw new Error('Missing Strapi configuration in environment variables');
  }

  // Using pagination with a large page size to fetch all solutions in one request
  const response = await fetch(`${strapiEndpoint}/${url}`, {
    headers: {
      Authorization: `Bearer ${strapiApiToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch solutions: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}
