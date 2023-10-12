import { getGuidePaths } from '@/lib/api';

export const urlRewrite = (url: string): string => {
  const isDocsUrl = url.startsWith('https://docs.pagopa.it');

  if (!isDocsUrl) {
    return url;
  }

  const cleanUrl = url.replace('https://docs.pagopa.it', '');

  const [urlGuide, ...rest] = cleanUrl.split('/').filter((p) => p !== '');

  const guides = getGuidePaths();

  const guide = guides.find((g) => g.guidePaths[0] === urlGuide);

  if (guide) {
    const finalUrl = `/${guide.slug}/guides/${guide.guidePaths.join(
      '/'
    )}/${rest.join('/')}`;

    return finalUrl;
  }

  return '/not-found';
};
