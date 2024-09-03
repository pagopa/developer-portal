import { mergeProductWithStaticContent } from './products';
import { TutorialsPageProps } from '@/app/[productSlug]/tutorials/page';
import { StrapiTutorialListPages } from './strapi/tutorialListCodec';
import { Tutorial } from './types/tutorialData';

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
        ({ attributes }) => ({
          name: attributes.title,
          path: `/${product.slug}/tutorials/${attributes.slug}`,
          title: attributes.title,
          publishedAt: attributes.publishedAt,
          showInOverview: false,
          image: attributes.image.data?.attributes,
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
