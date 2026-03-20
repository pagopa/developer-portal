import { fetchGuides } from './fetcher';
import { mapGuides } from './mapper';
import { GuideDefinition } from './types';

export const GuidesRepository = {
  getAll: async (locale: string): Promise<ReadonlyArray<GuideDefinition>> => {
    const rawData = await fetchGuides(locale);
    if (!rawData) {
      return [];
    }
    return mapGuides(locale, rawData);
  },

  getBySlug: async (
    locale: string,
    guideSlug: string
  ): Promise<GuideDefinition | undefined> => {
    const all = await GuidesRepository.getAll(locale);
    return all.find((guide) => guide.guide.slug === guideSlug);
  },

  getByProductAndSlug: async (
    locale: string,
    productSlug: string,
    guideSlug: string
  ): Promise<GuideDefinition | undefined> => {
    const all = await GuidesRepository.getAll(locale);
    return all.find(
      (guide) =>
        guide.guide.slug === guideSlug && guide.product.slug === productSlug
    );
  },
};
