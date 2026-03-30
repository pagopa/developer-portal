/* eslint-disable functional/no-expression-statements */
import { UseCasesPageProps } from '@/app/[locale]/[productSlug]/use-cases/page';
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/products/mapper';
import { UseCase } from '@/lib/useCases/types';
import { compact } from 'lodash';
import { StrapiUseCaseListPages } from './types';

export function mapUseCaseListPageProps(
  locale: string,
  strapiUseCaseList: StrapiUseCaseListPages
): readonly UseCasesPageProps[] {
  return compact(
    strapiUseCaseList.data.map((attributes) => {
      const slug = attributes.product?.slug;
      if (!slug) {
        console.error(
          `Error while processing UseCaseListPage ${attributes.title}: missing product slug. Skipping...`
        );
        return null;
      }

      const useCases: readonly UseCase[] = compact(
        attributes.useCases.map((useCaseAttributes) => {
          const useCaseProductSlug = useCaseAttributes.product?.slug;
          if (!useCaseProductSlug) {
            console.error(
              `Error while processing UseCase with title "${useCaseAttributes.title}": missing product slug. Skipping...`
            );
            return null;
          }

          if (!useCaseAttributes.slug || !useCaseAttributes.title) {
            console.error(
              `Error while processing UseCase: missing title or slug. Title: ${useCaseAttributes.title} | Slug: ${useCaseAttributes.slug}. Skipping...`
            );
            return null;
          }

          // eslint-disable-next-line functional/no-try-statements
          try {
            return {
              name: useCaseAttributes.title,
              path: `/${locale}/${useCaseProductSlug}/use-cases/${useCaseAttributes.slug}`,
              title: useCaseAttributes.title,
              publishedAt: useCaseAttributes.publishedAt
                ? new Date(useCaseAttributes.publishedAt)
                : undefined,
              showInOverview: false,
              coverImage: useCaseAttributes.coverImage,
              tags: useCaseAttributes.tags?.map((tag) => tag) || [],
            } satisfies UseCase;
          } catch (error) {
            console.error(
              `Error while processing UseCase with title ${useCaseAttributes.title}:`,
              error,
              'Skipping...'
            );
            return null;
          }
        })
      );

      return {
        path: `/${locale}/${attributes.product.slug}/use-cases`,
        product: makeBaseProductWithoutLogoProps(locale, attributes.product),
        abstract: {
          title: attributes.title,
          description: attributes.description,
        },
        seo: attributes.seo,
        useCases,
        bannerLinks:
          attributes.bannerLinks.length > 0
            ? attributes.bannerLinks.map(mapBannerLinkProps)
            : attributes.product.bannerLinks?.map(mapBannerLinkProps),
        enableFilters: attributes.enableFilters,
      } satisfies UseCasesPageProps;
    })
  );
}
