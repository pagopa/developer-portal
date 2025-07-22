/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-try-statements */

export async function fetchFromStrapi<T>(url: string): Promise<T[] | Error> {
  try {
    console.log('Fetching from Strapi...');
    const strapiEndpoint = process.env.STRAPI_ENDPOINT;
    const strapiApiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiEndpoint || !strapiApiToken) {
      return new Error('Missing Strapi configuration in environment variables');
    }

    // TODO: use pagination with a large page size to fetch all resources in one request
    const response = await fetch(`${strapiEndpoint}/${url}`, {
      headers: {
        Authorization: `Bearer ${strapiApiToken}`,
      },
    });

    if (!response.ok) {
      // eslint-disable-next-line functional/no-throw-statements
      return new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const output = await response.json();
    console.log(
      `Successfully fetched ${output.data?.length || 0} ${url} from Strapi`
    );
    return output.data || [];
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    return error as Error;
  }
}
