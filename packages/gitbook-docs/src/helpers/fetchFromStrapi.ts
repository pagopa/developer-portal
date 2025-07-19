/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-try-statements */

export async function fetchFromStrapi<T>(
  url: string
): Promise<{ data: T[]; responseJson?: any }> {
  try {
    const output = await fetchFromStrapiResponse(url);
    console.log(
      `Successfully fetched ${output.data?.length || 0} ${url} from Strapi`
    );
    return { data: output.data || [], responseJson: output };
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    return { data: [], responseJson: undefined };
  }
}

export async function getResponseFromStrapi(url: string) {
  try {
    const output = await fetchFromStrapiResponse(url);
    console.log(`Successfully fetched data from Strapi: ${url}`);
    return output;
  } catch (error) {
    console.error('Error fetching data from Strapi:', error);
    return undefined;
  }
}

async function fetchFromStrapiResponse(url: string) {
  try {
    console.log('Fetching solutions from Strapi...');
    const strapiEndpoint = process.env.STRAPI_ENDPOINT;
    const strapiApiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiEndpoint || !strapiApiToken) {
      console.error('Missing Strapi configuration in environment variables');
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Missing Strapi configuration in environment variables');
    }

    // Using pagination with a large page size to fetch all solutions in one request
    const response = await fetch(`${strapiEndpoint}/${url}`, {
      headers: {
        Authorization: `Bearer ${strapiApiToken}`,
      },
    });

    if (!response.ok) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        `Failed to fetch solutions: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    return error;
  }
}
