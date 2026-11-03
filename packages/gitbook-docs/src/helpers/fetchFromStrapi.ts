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
  // get first segment of the url to log what we are fetching
  const collectionSegment = url.split('/')[1];
  console.log(`Fetching ${collectionSegment} from Strapi...`);
  const strapiEndpoint = process.env.STRAPI_ENDPOINT;
  const strapiApiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiEndpoint || !strapiApiToken) {
    console.error('Missing Strapi configuration in environment variables');
    throw new Error('Missing Strapi configuration in environment variables');
  }

  // Using pagination with a large page size to fetch all ${collectionSegment} in one request
  const response = await fetch(`${strapiEndpoint}/${url}`, {
    headers: {
      Authorization: `Bearer ${strapiApiToken}`,
    },
  });

  if (!response.ok) {
    const rawBody = await response.text();
    // eslint-disable-next-line functional/no-let
    let parsedBody: unknown;

    // eslint-disable-next-line functional/no-try-statements
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : undefined;
    } catch {
      parsedBody = undefined;
    }

    console.error('Error response from Strapi', {
      collectionSegment,
      status: response.status,
      statusText: response.statusText,
      body: parsedBody ?? rawBody,
    });

    throw new Error(
      `Failed to fetch ${collectionSegment}: ${response.status} ${
        response.statusText
      }${rawBody ? ` - ${rawBody}` : ''}`
    );
  }

  return await response.json();
}
