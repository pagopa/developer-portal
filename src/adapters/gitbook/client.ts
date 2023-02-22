import { Api as GitBookAPI } from '@/adapters/gitbook/generated/client/Api';

type ClientConfig = {
  baseURL: URL;
  headers?: Record<string, string>;
  timeout?: number;
};

const makeGitBookApiClient = (config: ClientConfig) =>
  new GitBookAPI({
    timeout: config.timeout,
    headers: config.headers,
    baseURL: `${config.baseURL}/v1`,
  });

// TODO: Move this to a config file
const gitBookApiKey = process.env['GITBOOK_API_KEY'];
const gitBookBaseUrl =
  process.env['GITBOOK_BASE_URL'] || 'https://api.gitbook.com';
export const gitBookConfig = {
  baseURL: new URL(gitBookBaseUrl),
  orgId: process.env['GITBOOK_ORG_ID'] || '',
  apiKey: gitBookApiKey,
  headers: {
    Authorization: `Bearer ${gitBookApiKey}`,
  },
  apiTimeout: Number(process.env['GITBOOK_API_TIMEOUT_MS']),
};

export const gitBookClient = makeGitBookApiClient({
  baseURL: gitBookConfig.baseURL,
  headers: gitBookConfig.headers,
  timeout: gitBookConfig.apiTimeout,
});
