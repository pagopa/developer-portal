/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { GuideListPageData } from '@/app/[productSlug]/guides/page';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from './makeProducts';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import { compact } from 'lodash';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';

export function makeGuideListPages(
  strapiGuideListPages: StrapiGuideListPages
): readonly GuideListPageData[] {
  return compact(
    strapiGuideListPages.data.map(({ attributes }) => {
      const productData = attributes.product.data;
      if (!productData?.attributes.slug) {
        console.error(
          `Error while processing GuideListPage with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      try {
        const product = makeBaseProductWithoutLogo(productData);
        const guidesSections: readonly GuidesSectionProps[] = [
          ...attributes.guidesByCategory.map(({ category, guides }) => ({
            title: category,
            guides: compact(
              guides.data.map((guide) =>
                makeGuideCardProps(guide, product.slug)
              )
            ),
          })),
        ];
        return {
          path: `/${productData.attributes.slug}/guides`,
          product,
          abstract: {
            title: attributes.title,
            description: attributes.description,
          },
          guidesSections: [...guidesSections],
          bannerLinks:
            attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(makeBannerLink)
              : productData.attributes.bannerLinks?.map(makeBannerLink),
          seo: attributes.seo,
          updatedAt: attributes.updatedAt,
        } satisfies GuideListPageData;
      } catch (error) {
        console.error(
          `Error while processing Guide List Page for product with slug "${productData.attributes.slug}":`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}

function makeGuideCardProps(
  guide: StrapiBaseGuide,
  productSlug: string
): GuideCardProps | null {
  if (!guide.attributes.slug) {
    console.error('guide slug is missing:', guide);
    return null;
  }

  try {
    return {
      title: guide.attributes.title,
      description: {
        title: 'guideListPage.cardSection.listItemsTitle',
        listItems: guide.attributes.listItems.map(({ text }) => text),
        translate: true,
      },
      imagePath: guide.attributes.image?.data?.attributes?.url,
      mobileImagePath: guide.attributes.mobileImage?.data?.attributes?.url,
      link: {
        label: 'guideListPage.cardSection.linkLabel',
        href: `/${productSlug}/guides/${guide.attributes.slug}`,
        translate: true,
      },
    } satisfies GuideCardProps;
  } catch (error) {
    console.error(error);
    return null;
  }
}
