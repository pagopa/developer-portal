import { getAvailableSingleTypeLocales } from '@/lib/strapi/getAvailableSingleTypeLocales';
import { hasPublishedSingleType } from '@/lib/strapi/hasPublishedSingleType';
import type { StrapiEnv } from '@/lib/strapi/strapiEnv';

jest.mock('@/lib/strapi/hasPublishedSingleType');

const mockedHasPublishedSingleType = jest.mocked(hasPublishedSingleType);
const strapiEnv = {} as StrapiEnv;

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getAvailableSingleTypeLocales', () => {
  it('should return Italian and English when English is published', async () => {
    mockedHasPublishedSingleType.mockResolvedValue(true);

    const result = await getAvailableSingleTypeLocales(
      'homepage',
      'it',
      strapiEnv
    );

    expect(result).toEqual(['it', 'en']);
    expect(mockedHasPublishedSingleType).toHaveBeenCalledWith(
      'homepage',
      'en',
      strapiEnv
    );
  });

  it('should return Italian only when English is not published', async () => {
    mockedHasPublishedSingleType.mockResolvedValue(false);

    const result = await getAvailableSingleTypeLocales(
      'homepage',
      'it',
      strapiEnv
    );

    expect(result).toEqual(['it']);
  });

  it('should return English and Italian when Italian is published', async () => {
    mockedHasPublishedSingleType.mockResolvedValue(true);

    const result = await getAvailableSingleTypeLocales(
      'solution-list-page',
      'en',
      strapiEnv
    );

    expect(result).toEqual(['en', 'it']);
    expect(mockedHasPublishedSingleType).toHaveBeenCalledWith(
      'solution-list-page',
      'it',
      strapiEnv
    );
  });

  it('should return English only when Italian is not published', async () => {
    mockedHasPublishedSingleType.mockResolvedValue(false);

    const result = await getAvailableSingleTypeLocales(
      'solution-list-page',
      'en',
      strapiEnv
    );

    expect(result).toEqual(['en']);
  });

  it('should preserve the current locale when another locale fails', async () => {
    const error = new Error('English page error');
    mockedHasPublishedSingleType.mockRejectedValue(error);

    const result = await getAvailableSingleTypeLocales(
      'homepage',
      'it',
      strapiEnv
    );

    expect(result).toEqual(['it']);
    expect(mockedHasPublishedSingleType).toHaveBeenCalledWith(
      'homepage',
      'en',
      strapiEnv
    );
  });

  it('should not check the current locale again', async () => {
    mockedHasPublishedSingleType.mockResolvedValue(true);

    await getAvailableSingleTypeLocales('homepage', 'it', strapiEnv);

    expect(mockedHasPublishedSingleType).toHaveBeenCalledTimes(1);
    expect(mockedHasPublishedSingleType).not.toHaveBeenCalledWith(
      'homepage',
      'it',
      strapiEnv
    );
  });
});
