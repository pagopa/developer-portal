import { mergeProductWithStaticContent } from './makeProducts';
import { TutorialsPageProps } from '@/app/[productSlug]/tutorials/page';
import { Tutorial } from '../../types/tutorialData';
import { StrapiTutorialListPages } from '../codecs/TutorialListPagesCodec';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

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
        seo: attributes.seo,
        tutorials: tutorials,
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map((bannerLink) =>
                makeBannerLinkProps(bannerLink)
              )
            : attributes.product.data.attributes.bannerLinks?.map(
                (bannerLink) => makeBannerLinkProps(bannerLink)
              ),
      };
    }),
    ...staticTutorialListPages,
  ];
}
