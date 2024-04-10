import ProviderLocal from '@strapi/provider-upload-local';
import { getAbsoluteServerUrl } from '@strapi/utils';

const prefixFileUrlWithBackendUrl = (fileURL?: string): string | undefined => {
  const baseUrl = getAbsoluteServerUrl(strapi.config);
  return !!fileURL && fileURL.startsWith('/')
    ? `${baseUrl}${fileURL}`
    : fileURL;
};

export const init: typeof ProviderLocal.init = (options) => {
  const fns = ProviderLocal.init(options);

  return {
    ...fns,
    async uploadStream(file) {
      // eslint-disable-next-line functional/no-expression-statements
      await fns.uploadStream(file);
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data, @typescript-eslint/no-non-null-assertion
      file.url = prefixFileUrlWithBackendUrl(file.url)!;
    },
    async upload(file) {
      // eslint-disable-next-line functional/no-expression-statements
      await fns.upload(file);
      // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data, @typescript-eslint/no-non-null-assertion
      file.url = prefixFileUrlWithBackendUrl(file.url)!;
    },
  };
};
