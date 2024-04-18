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
      await fns.uploadStream(file);
      file.url = prefixFileUrlWithBackendUrl(file.url)!;
    },
    async upload(file) {
      await fns.upload(file);
      file.url = prefixFileUrlWithBackendUrl(file.url)!;
    },
  };
};
