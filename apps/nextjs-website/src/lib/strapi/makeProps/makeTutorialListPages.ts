import { TutorialsPageProps } from '@/app/[productSlug]/tutorials/page';
import { Tutorial } from '@/lib/types/tutorialData';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import _ from 'lodash';

export function makeTutorialListPagesProps(
  strapiTutorialList: StrapiTutorialListPages
): readonly TutorialsPageProps[] {
  return _.compact(
    strapiTutorialList.data.map(({ attributes }) => {
      const slug = attributes.product.data.attributes.slug;
      if (!slug) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Tutorial List Page ${attributes.title} is missing product slug. Skipping...`
        );
        return null;
      }
      const tutorials: readonly Tutorial[] = _.compact(
        attributes.tutorials.data.map(({ attributes: tutorialAttributes }) => {
          const slug = tutorialAttributes.product?.data?.attributes?.slug;
          if (!slug) {
            // eslint-disable-next-line functional/no-expression-statements
            console.error(
              `Tutorial ${tutorialAttributes.title} is missing product slug. Skipping...`
            );
            return null;
          }
          if (!tutorialAttributes.slug) {
            // eslint-disable-next-line functional/no-expression-statements
            console.error(
              `Tutorial ${tutorialAttributes.title} is missing slug. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            return {
              name: tutorialAttributes.title,
              path: `/${slug}/tutorials/${tutorialAttributes.slug}`,
              title: tutorialAttributes.title,
              publishedAt: tutorialAttributes.publishedAt
                ? new Date(tutorialAttributes.publishedAt)
                : undefined,
              showInOverview: false,
              image: tutorialAttributes.image.data?.attributes,
              tags:
                tutorialAttributes.tags?.data?.map((tag) => tag.attributes) ||
                [],
            } satisfies Tutorial;
          } catch (error) {
            // eslint-disable-next-line functional/no-expression-statements
            console.error(
              `Error processing tutorial ${tutorialAttributes.title}: ${error}`
            );
            return null;
          }
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
            : attributes.product.data.attributes.bannerLinks?.map(
                (bannerLink) => makeBannerLinkProps(bannerLink)
              ),
      };
    })
  );
}
