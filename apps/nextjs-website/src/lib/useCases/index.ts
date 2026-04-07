import { buildEnv } from '@/lib/buildEnv';
import { getMarkdownContent } from '@/lib/api';
import { isMarkDownPart } from '@/lib/parts/types';
import { fetchUseCases } from './fetcher';
import { mapUseCasesProps } from './mapper';
import { UseCaseProps } from './types';

const makeMarkdownContentDict = async (
  markdownParts: ReadonlyArray<{
    readonly dirName: string;
    readonly pathToFile: string;
  }>
) => {
  const resolvedContentPairs = await Promise.all(
    markdownParts.map(async ({ dirName, pathToFile }) => {
      const key = `${dirName}/${pathToFile}`;
      const content = await getMarkdownContent(dirName, pathToFile);
      return [key, content] as const;
    })
  );

  return Object.fromEntries(resolvedContentPairs);
};

export const UseCasesRepository = {
  getAll: async (locale: string): Promise<readonly UseCaseProps[]> => {
    const strapiUseCases = await fetchUseCases(locale, buildEnv);
    const markdownParts = strapiUseCases.data.flatMap((useCase) =>
      (useCase?.parts ?? []).filter(isMarkDownPart)
    );
    const markdownContentDict = await makeMarkdownContentDict(markdownParts);

    return mapUseCasesProps(locale, strapiUseCases, markdownContentDict);
  },

  getByPath: async (
    locale: string,
    path: string
  ): Promise<UseCaseProps | undefined> => {
    const all = await UseCasesRepository.getAll(locale);
    return all.find((useCase) => useCase.path === path);
  },
};
