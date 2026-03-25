import { buildEnv } from '@/lib/buildEnv';
import { getMarkdownContent } from '@/lib/api';
import { isMarkDownPart } from '@/lib/parts/types';
import { fetchTutorials } from './fetcher';
import { mapTutorialsProps } from './mapper';
import { TutorialProps } from './types';

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

export const TutorialRepository = {
  getAll: async (locale: string): Promise<readonly TutorialProps[]> => {
    const strapiTutorials = await fetchTutorials(locale, buildEnv);
    const markdownParts = strapiTutorials.data.flatMap((tutorial) =>
      (tutorial?.parts ?? []).filter(isMarkDownPart)
    );
    const markdownContentDict = await makeMarkdownContentDict(markdownParts);

    return mapTutorialsProps(locale, strapiTutorials, markdownContentDict);
  },

  getByPath: async (
    locale: string,
    path: string
  ): Promise<TutorialProps | undefined> => {
    const all = await TutorialRepository.getAll(locale);
    return all.find((tutorial) => tutorial.path === path);
  },
};
