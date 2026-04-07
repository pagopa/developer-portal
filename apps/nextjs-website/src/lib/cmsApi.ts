import { makeGuide as makeGuideS3 } from '@/helpers/makeS3Docs.helpers';

import { GuidesRepository } from '@/lib/guides';

export const getGuideProps = async (
  guidePaths: ReadonlyArray<string>,
  locale: string,
  productSlug: string
) => {
  const guide = await GuidesRepository.getByProductAndSlug(
    locale,
    productSlug,
    guidePaths[0]
  );
  if (!guide) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch guide data');
  }
  return await makeGuideS3({ guideDefinition: guide, locale, guidePaths });
};
