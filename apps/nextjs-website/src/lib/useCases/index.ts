import { buildEnv } from '@/lib/buildEnv';
import { isMarkDownPart } from '@/lib/parts/strapiTypes';
import { getMarkdownContentDict } from '@/helpers/s3Metadata.helpers';
import { fetchUseCases } from './fetcher';
import { mapUseCasesProps } from './mapper';
import type { UseCaseProps } from './strapiTypes';
import { SUPPORTED_LOCALES } from '@/locales';

export const UseCasesRepository = {
  /**
   * Returns all Use Cases
   * @param locale The locale used to get the Use Cases.
   * @returns An array of Use Cases with all their fields.
   */
  getAll: async (locale: string): Promise<readonly UseCaseProps[]> => {
    const strapiUseCases = await fetchUseCases(locale, buildEnv);
    const markdownParts = strapiUseCases.data.flatMap((useCase) =>
      (useCase?.parts ?? []).filter(isMarkDownPart)
    );
    const markdownContentDict = await getMarkdownContentDict(
      locale,
      markdownParts
    );

    return mapUseCasesProps(locale, strapiUseCases, markdownContentDict);
  },
  /**
   * Returns a Use Case by its path
   * @param locale The locale used to get the Use Cases.
   * @param path The path of the Use Case to retrieve.
   * @returns The matching Use Case, or `undefined` if no entry is found.
   */
  getByPath: async (
    locale: string,
    path: string
  ): Promise<UseCaseProps | undefined> => {
    const all = await UseCasesRepository.getAll(locale);
    return all.find((useCase) => useCase.path === path);
  },
  getLocalizedPaths: async (
    currentLocale: string,
    useCase: UseCaseProps
  ): Promise<
    readonly { readonly langCode: string; readonly path: string }[]
  > => {
    if (!useCase.documentId) {
      return [];
    }

    const otherLocales = SUPPORTED_LOCALES.filter(
      ({ langCode }) => langCode !== currentLocale
    );

    const translations = await Promise.all(
      otherLocales.map(async ({ langCode }) => {
        const useCases = await UseCasesRepository.getAll(langCode);

        const translatedUseCase = useCases.find(
          ({ documentId }) => documentId === useCase.documentId
        );

        return translatedUseCase
          ? {
              langCode,
              path: translatedUseCase.path,
            }
          : null;
      })
    );

    return [
      {
        langCode: currentLocale,
        path: useCase.path,
      },
      ...translations.filter(
        (
          translation
        ): translation is {
          readonly langCode: string;
          readonly path: string;
        } => translation !== null
      ),
    ];
  },
};
