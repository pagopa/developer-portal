/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-try-statements */

// Function to fetch solutions from Strapi
export async function fetchFromStrapi<T>(url: string): Promise<T[]> {
  try {
    console.log('Fetching solutions from Strapi...');
    const strapiEndpoint = process.env.STRAPI_ENDPOINT;
    const strapiApiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiEndpoint || !strapiApiToken) {
      console.error('Missing Strapi configuration in environment variables');
      return [];
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

    const solutionsData = await response.json();
    console.log(
      `Successfully fetched ${
        solutionsData.data?.length || 0
      } solutions from Strapi`
    );
    return solutionsData.data || [];
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    return [];
  }
}
