export async function fetchFromStrapiResponse<T = unknown>(
  path: string,
  opts?: {
    readonly method: 'GET' | 'PUT';
    readonly body: unknown;
  }
): Promise<T> {
  const strapiEndpoint = process.env.STRAPI_API_URL;
  const strapiApiToken = process.env.STRAPI_IVS_API_TOKEN; // TODO: check if is better to have more generic token (write or write and read)

  if (!strapiEndpoint || !strapiApiToken) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'fetchFromStrapiResponse - Missing Strapi configuration in environment variables'
    );
  }

  const method = opts?.method || 'GET';
  const baseHeaders: Record<string, string> = {
    Authorization: `Bearer ${strapiApiToken}`,
  };

  // eslint-disable-next-line functional/no-let
  let body: string | undefined;
  if (method === 'PUT') {
    body = opts?.body !== undefined ? JSON.stringify(opts.body) : '{}';
    if (!baseHeaders['Content-Type']) {
      baseHeaders['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(`${strapiEndpoint}/${path}`, {
    method,
    headers: baseHeaders,
    body,
  });

  if (!response.ok) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `Strapi request failed: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}
