/* eslint-disable functional/no-expression-statements */
import { TutorialsPageProps } from '@/app/[locale]/[productSlug]/tutorials/page';
import { Tutorial } from '@/lib/types/tutorialData';
import { mapBannerLinkProps } from '@/lib/shared/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/product/mapper';
import { StrapiTutorialListPages } from '@/lib/strapi/types/tutorialsListPage';
import { compact } from 'lodash';

export function makeTutorialListPagesProps(
  locale: string,
  strapiTutorialList: StrapiTutorialListPages
): readonly TutorialsPageProps[] {
  return compact(
    strapiTutorialList.data.map((attributes) => {
      const slug = attributes.product?.slug;
      if (!slug) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error while processing TutorialListPage ${attributes.title}: missing product slug. Skipping...`
        );
        return null;
      }

      const tutorials: readonly Tutorial[] = compact(
        attributes.tutorials.map((tutorialAttributes) => {
          const slug = tutorialAttributes.product?.slug;
          if (!slug) {
            console.error(
              `Error while processing Tutorial with title "${tutorialAttributes.title}": missing product slug. Skipping...`
            );
            return null;
          }

          if (!tutorialAttributes.slug || !tutorialAttributes.title) {
            console.error(
              `Error while processing Tutorial: missing title or slug. Title: ${tutorialAttributes.title} | Slug: ${tutorialAttributes.slug}. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            return {
              updatedAt: tutorialAttributes.updatedAt,
              name: tutorialAttributes.title,
              path: `/${locale}/${slug}/tutorials/${tutorialAttributes.slug}`,
              title: tutorialAttributes.title,
              publishedAt: tutorialAttributes.publishedAt
                ? new Date(tutorialAttributes.publishedAt)
                : undefined,
              showInOverview: false,
              image: tutorialAttributes.image,
              tags: tutorialAttributes.tags?.map((tag) => tag) || [],
            } satisfies Tutorial;
          } catch (error) {
            // eslint-disable-next-line functional/no-expression-statements
            console.error(
              `Error while processing Tutorial with title ${tutorialAttributes.title}:`,
              error,
              'Skipping...'
            );
            return null;
          }
        })
      );
      const updatedAt =
        attributes.tutorials.length > 0
          ? attributes.tutorials.reduce((latest, current) => {
              const latestDate = new Date(latest.updatedAt);
              const currentDate = new Date(current.updatedAt);
              return currentDate > latestDate ? current : latest;
            }).updatedAt
          : '';

      return {
        updatedAt: updatedAt,
        name: attributes.title,
        path: `/${locale}/${attributes.product.slug}/tutorials`,
        product: makeBaseProductWithoutLogoProps(locale, attributes.product),
        abstract: {
          title: attributes.title,
          description: attributes.description,
        },
        seo: attributes.seo,
        tutorials: tutorials,
        enableFilters: attributes.enableFilters,
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map((bannerLink) =>
                mapBannerLinkProps(bannerLink)
              )
            : attributes.product.bannerLinks?.map((bannerLink) =>
                mapBannerLinkProps(bannerLink)
              ),
      };
    })
  );
}
