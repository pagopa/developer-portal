import { makeHreflangUrls } from '@/helpers/metadata.helpers';
import { GuidesRepository } from '@/lib/guides';
import type { Guide } from '@/lib/guides/types';

type GuideSeoParams = {
  readonly currentLocale: string;
  readonly guide: Pick<Guide, 'documentId' | 'seo'>;
  readonly pagePath: string;
  readonly pathPrefix: string;
  readonly version: {
    readonly main: boolean;
    readonly name: string;
  };
};

const appendRelativePath = (
  canonicalURL: string,
  relativePath: string
): string =>
  relativePath
    ? new URL(
        relativePath.replace(/^\//, ''),
        `${canonicalURL.replace(/\/$/, '')}/`
      ).toString()
    : canonicalURL;

export const getGuideSeoUrls = async ({
  currentLocale,
  guide,
  pagePath,
  pathPrefix,
  version,
}: GuideSeoParams) => {
  const basePath = version.main
    ? pathPrefix
    : pathPrefix.slice(0, -`/${version.name}`.length);

  const canonicalURL = guide.seo?.canonicalURL;
  const canonical = canonicalURL
    ? pagePath === basePath || pagePath.startsWith(`${basePath}/`)
      ? appendRelativePath(canonicalURL, pagePath.slice(basePath.length))
      : canonicalURL
    : undefined;

  if (!version.main) {
    return { canonical, languages: {} };
  }

  const localizedPaths = await GuidesRepository.getLocalizedPaths(
    currentLocale,
    guide,
    pagePath,
    pathPrefix,
    version
  );

  return {
    canonical,
    languages: makeHreflangUrls(localizedPaths),
  };
};
