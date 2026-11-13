import { SUPPORTED_LOCALES } from '@/locales';

export type LocalizedPath = {
  readonly langCode: string;
  readonly path: string;
};

type Localizable = {
  readonly documentId?: string;
};

type LocalizedPathsOptions<T extends Localizable> = {
  readonly currentLocale: string;
  readonly currentItem: T;
  readonly getAll: (locale: string) => Promise<readonly T[]>;
  readonly getPath: (
    locale: string,
    item: T
  ) => string | undefined | Promise<string | undefined>;
};

export const getLocalizedPaths = async <T extends Localizable>({
  currentLocale,
  currentItem,
  getAll,
  getPath,
}: LocalizedPathsOptions<T>): Promise<readonly LocalizedPath[]> => {
  if (!currentItem.documentId) {
    return [];
  }

  const currentPath = await getPath(currentLocale, currentItem);
  const translations = await Promise.all(
    SUPPORTED_LOCALES.filter(({ langCode }) => langCode !== currentLocale).map(
      async ({ langCode }) => {
        const items = await getAll(langCode);
        const translation = items.find(
          ({ documentId }) => documentId === currentItem.documentId
        );

        if (!translation) {
          return null;
        }

        const path = await getPath(langCode, translation);
        return path ? { langCode, path } : null;
      }
    )
  );

  return [
    ...(currentPath ? [{ langCode: currentLocale, path: currentPath }] : []),
    ...translations.filter(
      (translation): translation is LocalizedPath => translation !== null
    ),
  ];
};

type GitBookLocalizedPathsOptions<T extends Localizable> = {
  readonly currentLocale: string;
  readonly currentItem: T;
  readonly currentPagePath: string;
  readonly getAll: (locale: string) => Promise<readonly T[]>;
  readonly getBasePath: (locale: string, item: T) => string;
  readonly getMetadataPaths: (
    locale: string,
    item: T
  ) => Promise<readonly { readonly path: string }[]>;
};

export const getLocalizedGitBookPaths = async <T extends Localizable>({
  currentLocale,
  currentItem,
  currentPagePath,
  getAll,
  getBasePath,
  getMetadataPaths,
}: GitBookLocalizedPathsOptions<T>): Promise<readonly LocalizedPath[]> => {
  if (!currentItem.documentId || !currentPagePath) {
    return [];
  }

  const basePath = getBasePath(currentLocale, currentItem);
  if (
    currentPagePath !== basePath &&
    !currentPagePath.startsWith(`${basePath}/`)
  ) {
    return [];
  }

  const relativePath = currentPagePath.slice(basePath.length);
  return getLocalizedPaths({
    currentLocale,
    currentItem,
    getAll,
    getPath: async (locale, item) => {
      if (locale === currentLocale) {
        return currentPagePath;
      }

      const translatedPath = `${getBasePath(locale, item)}${relativePath}`;
      const metadata = await getMetadataPaths(locale, item);
      return metadata.some(({ path }) => path === translatedPath)
        ? translatedPath
        : undefined;
    },
  });
};
