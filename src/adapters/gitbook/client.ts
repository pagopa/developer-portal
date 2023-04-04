import { GitBookAPI } from '@gitbook/api';

export const makeGitBookClient = (apiKey: string) => {
  return new GitBookAPI({
    authToken: apiKey,
  });
};
