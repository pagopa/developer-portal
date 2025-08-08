import { TutorialsPageProps } from '@/app/[productSlug]/tutorials/page';
import { Tutorial } from '../../types/tutorialData';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';

export function makeTutorialsPageProps(
  strapiTutorialList: StrapiTutorialListPages
): readonly TutorialsPageProps[] {
  return strapiTutorialList.data.map(({ attributes }) => {
    const tutorials: readonly Tutorial[] = attributes.tutorials.data.map(
      ({ attributes: tutorialAttributes }) => ({
        name: tutorialAttributes.title,
        path: `/${tutorialAttributes.product.data.attributes.slug}/tutorials/${tutorialAttributes.slug}`,
        title: tutorialAttributes.title,
        publishedAt: tutorialAttributes.publishedAt
          ? new Date(tutorialAttributes.publishedAt)
          : undefined,
        showInOverview: false,
        image: tutorialAttributes.image.data?.attributes,
      })
    );

    return {
      name: attributes.title,
      path: `/${attributes.product.data.attributes.slug}/tutorials`,
      product: makeBaseProductWithoutLogoProps(attributes.product.data),
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
          : attributes.product.data.attributes.bannerLinks?.map((bannerLink) =>
              makeBannerLinkProps(bannerLink)
            ),
    };
  });
}
