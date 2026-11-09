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
  if (!guide.seo?.canonicalURL) {
    return { canonical: undefined, languages: {} };
  }

  const basePath = version.main
    ? pathPrefix
    : pathPrefix.slice(0, -`/${version.name}`.length);

  if (pagePath !== basePath && !pagePath.startsWith(`${basePath}/`)) {
    return { canonical: guide.seo.canonicalURL, languages: {} };
  }

  const canonical = appendRelativePath(
    guide.seo.canonicalURL,
    pagePath.slice(basePath.length)
  );

  const localizedPaths = await GuidesRepository.getLocalizedPaths(
    currentLocale,
    guide,
    pagePath,
    pathPrefix,
    version
  );

  const entries = await Promise.all(
    localizedPaths.map(async ({ langCode, path }) => {
      if (langCode === currentLocale) {
        return [langCode, canonical] as const;
      }

      const translatedGuide = (await GuidesRepository.getAll(langCode)).find(
        ({ documentId }) => documentId === guide.documentId
      );

      if (!translatedGuide?.seo?.canonicalURL || !translatedGuide.guide.slug) {
        return null;
      }

      const translatedBasePath = `/${langCode}/${translatedGuide.product.slug}/guides/${translatedGuide.guide.slug}`;

      if (
        path !== translatedBasePath &&
        !path.startsWith(`${translatedBasePath}/`)
      ) {
        return null;
      }

      return [
        langCode,
        appendRelativePath(
          translatedGuide.seo.canonicalURL,
          path.slice(translatedBasePath.length)
        ),
      ] as const;
    })
  );

  const languages = Object.fromEntries(
    entries.filter(
      (entry): entry is NonNullable<typeof entry> => entry !== null
    )
  );

  return {
    canonical,
    languages: {
      ...languages,
      ...(languages.it && { 'x-default': languages.it }),
    },
  };
};
