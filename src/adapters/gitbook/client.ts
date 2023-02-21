import { Api as GitBookAPI } from '@/adapters/gitbook/generated/api/Api';

type ClientConfig = {
  baseURL: URL;
  headers?: Record<string, string>;
  timeout?: number;
};

export const makeGitBookApiClient = (config: ClientConfig) =>
  new GitBookAPI({
    baseUrl: `${config.baseURL}/v1`,
    baseApiParams: { headers: config.headers },
  });
