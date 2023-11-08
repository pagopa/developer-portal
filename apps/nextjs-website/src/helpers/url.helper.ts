import { getGuidePaths } from '@/lib/api';

export const urlRewrite = (url: string): string => {
  const DOCS_URL = 'https://docs.pagopa.it';
  const allowedHosts = ['docs.pagopa.it'];
  const host = new URL(url).host;

  const isDocsUrl = allowedHosts.includes(host);

  if (!isDocsUrl) {
    return url;
  }

  const cleanUrl = url.replace(DOCS_URL, '');

  const [urlGuide, ...rest] = cleanUrl.split('/').filter((p) => p !== '');

  const guides = getGuidePaths();

  const guide = guides.find((g) => g.guidePaths[0] === urlGuide);

  if (guide) {
    const finalUrl = `/${guide.slug}/guides/${guide.guidePaths.join(
      '/'
    )}/${rest.join('/')}`;

    return finalUrl;
  }

  return url;
};
