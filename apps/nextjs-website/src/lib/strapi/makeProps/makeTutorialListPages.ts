import { mergeProductWithStaticContent } from './makeProducts';
import { TutorialsPageProps } from '@/app/[productSlug]/tutorials/page';
import { Tutorial } from '../../types/tutorialData';
import { StrapiTutorialListPages } from '../codecs/TutorialListPagesCodec';

type StaticTutorialListPages = readonly TutorialsPageProps[];

export function makeTutorialListPagesProps(
  strapiTutorialListPages: StrapiTutorialListPages,
  staticTutorialListPages: StaticTutorialListPages
): readonly TutorialsPageProps[] {
  return [
    ...strapiTutorialListPages.data.map(({ attributes }) => {
      const product = mergeProductWithStaticContent(
        attributes.product.data.attributes
      );
      const tutorials: readonly Tutorial[] = attributes.tutorials.data.map(
        ({ attributes: tutorialAttributes }) => ({
          name: tutorialAttributes.title,
          path: `/${tutorialAttributes.product.data.attributes.slug}/tutorials/${tutorialAttributes.slug}`,
          title: tutorialAttributes.title,
          publishedAt: tutorialAttributes.publishedAt,
          showInOverview: false,
          image: tutorialAttributes.image.data?.attributes,
        })
      );
      return {
        name: attributes.title,
        path: `/${product.slug}/tutorials`,
        product,
        abstract: {
          title: attributes.title,
          description: attributes.description,
        },
        tutorials: tutorials,
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map((bannerLink) => ({
                ...bannerLink,
                title: bannerLink.title || '',
                icon: bannerLink.icon?.data?.attributes,
              }))
            : product.bannerLinks,
      };
    }),
    ...staticTutorialListPages,
  ];
}
