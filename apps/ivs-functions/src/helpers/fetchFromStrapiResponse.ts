import { SSMClient } from '@aws-sdk/client-ssm';
import { getParameter } from './ssmClientHelper';

export type StrapiEnv = {
  readonly apiUrl: string;
  readonly ivsApiToken: string;
};

export async function getStrapiEnv(): Promise<StrapiEnv> {
  const ssmClient = new SSMClient({});
  const strapiApiToken = await getParameter(
    process.env.STRAPI_IVS_API_TOKEN || '',
    ssmClient
  );
  const strapiApiUrl = process.env.STRAPI_API_URL;

  if (!strapiApiToken || !strapiApiUrl) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'getStrapiEnv - Missing Strapi configuration in environment variables'
    );
  }

  return {
    apiUrl: strapiApiUrl,
    ivsApiToken: strapiApiToken,
  };
}

export async function fetchFromStrapiResponse<T = unknown>(
  env: StrapiEnv,
  path: string,
  opts?: {
    readonly method: 'GET' | 'PUT';
    readonly body: unknown;
  }
): Promise<T> {
  const method = opts?.method || 'GET';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.ivsApiToken}`,
    'Strapi-Response-Format': 'v4',
  };

  // eslint-disable-next-line functional/no-let
  let body: string | undefined;
  if (method === 'PUT') {
    body = opts?.body !== undefined ? JSON.stringify(opts.body) : '{}';
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${env.apiUrl}/${path}`, {
    method,
    headers: headers,
    body,
    cache: 'no-store',
  });

  if (!response.ok) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `Strapi request failed: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}
