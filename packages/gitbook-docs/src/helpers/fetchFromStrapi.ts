/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-try-statements */

// Validate Strapi environment variables
export function validateStrapiEnvironment(customRequiredVars: string[] = []): {
  missingVars: string[];
} {
  // Check for required environment variables
  const defaultRequiredVars = ['STRAPI_ENDPOINT', 'STRAPI_API_TOKEN'];
  const requiredEnvVars = [...defaultRequiredVars, ...customRequiredVars];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: Missing Strapi environment variables: ${missingEnvVars.join(
        ', '
      )}`
    );
    console.log('Continuing with available environment variables...');
  }

  return { missingVars: missingEnvVars };
}

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

    const data = await response.json();
    console.log(
      `Successfully fetched ${data.data?.length || 0} solutions from Strapi`
    );
    return data.data || [];
  } catch (error) {
    console.error('Error fetching solutions from Strapi:', error);
    return [];
  }
}
