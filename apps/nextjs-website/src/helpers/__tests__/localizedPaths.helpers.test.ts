import {
  getLocalizedGitBookPaths,
  getLocalizedPaths,
} from '@/helpers/localizedPaths.helpers';

type Item = {
  readonly documentId?: string;
  readonly slug: string;
};

const italian: Item = { documentId: 'doc-1', slug: 'italiano' };
const english: Item = { documentId: 'doc-1', slug: 'english' };

const getAll = async (locale: string): Promise<readonly Item[]> =>
  locale === 'en' ? [english] : [italian];

describe('getLocalizedPaths', () => {
  it('does not generate paths without documentId', async () => {
    const result = await getLocalizedPaths({
      currentLocale: 'it',
      currentItem: { slug: 'italiano' },
      getAll,
      getPath: (locale, item) => `/${locale}/${item.slug}`,
    });
    expect(result).toEqual([]);
  });

  it('resolves actual translated slugs', async () => {
    const result = await getLocalizedPaths({
      currentLocale: 'it',
      currentItem: italian,
      getAll,
      getPath: (locale, item) => `/${locale}/${item.slug}`,
    });
    expect(result).toEqual([
      { langCode: 'it', path: '/it/italiano' },
      { langCode: 'en', path: '/en/english' },
    ]);
  });

  it('omits missing or redirected translations', async () => {
    const result = await getLocalizedPaths({
      currentLocale: 'it',
      currentItem: italian,
      getAll,
      getPath: (locale, item) =>
        locale === 'en' ? undefined : `/${locale}/${item.slug}`,
    });
    expect(result).toEqual([{ langCode: 'it', path: '/it/italiano' }]);
  });
});

describe('getLocalizedGitBookPaths', () => {
  const options = {
    currentLocale: 'it',
    currentItem: italian,
    currentPagePath: '/it/italiano/details/intro',
    getAll,
    getBasePath: (locale: string, item: Item) =>
      `/${locale}/${item.slug}/details`,
  };

  it('includes existing translated GitBook pages', async () => {
    const result = await getLocalizedGitBookPaths({
      ...options,
      getMetadataPaths: async () => [{ path: '/en/english/details/intro' }],
    });
    expect(result).toEqual([
      { langCode: 'it', path: '/it/italiano/details/intro' },
      { langCode: 'en', path: '/en/english/details/intro' },
    ]);
  });

  it('excludes missing GitBook pages', async () => {
    const result = await getLocalizedGitBookPaths({
      ...options,
      getMetadataPaths: async () => [],
    });
    expect(result).toEqual([
      { langCode: 'it', path: '/it/italiano/details/intro' },
    ]);
  });

  it('rejects unrelated page paths', async () => {
    const result = await getLocalizedGitBookPaths({
      ...options,
      currentPagePath: '/it/another/details/intro',
      getMetadataPaths: async () => [],
    });
    expect(result).toEqual([]);
  });
});
