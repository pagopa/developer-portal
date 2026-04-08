/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { GuideListPageProps } from '@/app/[locale]/[productSlug]/guides/page';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/products/mapper';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import type { StrapiBaseGuide } from '@/lib/guides/strapiTypes';
import { compact } from 'lodash';
import { StrapiGuideListPages } from './types';

export function mapGuideListPages(
  locale: string,
  strapiGuideListPages: StrapiGuideListPages
): readonly GuideListPageProps[] {
  return compact(
    strapiGuideListPages.data.map((attributes) => {
      const productData = attributes.product;
      if (!productData?.slug) {
        console.error(
          `Error while processing GuideListPage with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        const product = makeBaseProductWithoutLogoProps(locale, productData);
        const guidesSections: readonly GuidesSectionProps[] = [
          ...attributes.guidesByCategory.map(({ category, guides }) => ({
            title: category,
            guides: compact(
              guides.map((guide) =>
                makeGuideCardProps(locale, guide, product.slug)
              )
            ),
          })),
        ];
        return {
          path: `/${locale}/${productData.slug}/guides`,
          product,
          abstract: {
            title: attributes.title,
            description: attributes.description,
          },
          guidesSections: [...guidesSections],
          bannerLinks:
            attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(mapBannerLinkProps)
              : productData.bannerLinks?.map(mapBannerLinkProps),
          seo: attributes.seo,
          updatedAt: attributes.updatedAt,
        } satisfies GuideListPageProps;
      } catch (error) {
        console.error(
          `Error while processing Guide List Page for product with slug "${productData.slug}":`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

function makeGuideCardProps(
  locale: string,
  guide: StrapiBaseGuide,
  productSlug: string
): GuideCardProps | null {
  if (!guide.slug) {
    console.error('guide slug is missing:', guide);
    return null;
  }

  try {
    return {
      title: guide.title,
      description: {
        title: 'guideListPage.cardSection.listItemsTitle',
        listItems: guide.listItems.map(({ text }) => text),
        translate: true,
      },
      imagePath: guide.image?.url,
      mobileImagePath: guide.mobileImage?.url,
      link: {
        label: 'guideListPage.cardSection.linkLabel',
        href: `/${locale}/${productSlug}/guides/${guide.slug}`,
        translate: true,
      },
    } satisfies GuideCardProps;
  } catch (error) {
    console.error(error);
    return null;
  }
}
