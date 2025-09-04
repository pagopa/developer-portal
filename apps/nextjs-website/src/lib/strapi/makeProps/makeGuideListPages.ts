import { GuideListPageProps } from '@/app/[productSlug]/guides/page';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from './makeProducts';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import { StrapiBaseGuide } from '@/lib/strapi/types/guide';
import _ from 'lodash';
import { StrapiGuideListPages } from '@/lib/strapi/types/guideListPage';

export function makeGuideListPages(
  strapiGuideListPages: StrapiGuideListPages
): readonly GuideListPageProps[] {
  return _.compact(
    strapiGuideListPages.data.map(({ attributes }) => {
      const productData = attributes.product.data;
      if (!productData.attributes.slug) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error('product slug is missing:', productData);
        return null;
      }

      const product = makeBaseProductWithoutLogo(productData);
      const guidesSections: readonly GuidesSectionProps[] = [
        ...attributes.guidesByCategory.map(({ category, guides }) => ({
          title: category,
          guides: _.compact(
            guides.data.map((guide) => makeGuideCard(guide, product.slug))
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
      } satisfies GuideListPageProps;
    })
  );
}

function makeGuideCard(
  guide: StrapiBaseGuide,
  productSlug: string
): GuideCardProps | null {
  if (!guide.attributes.slug) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('guide slug is missing:', guide);
    return null;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
    return {
      title: guide.attributes.title,
      description: {
        title: 'guideListPage.cardSection.listItemsTitle', // this is a translations path and it will be translated by the component
        listItems: guide.attributes.listItems.map(({ text }) => text),
        translate: true,
      },
      imagePath: guide.attributes.image?.data?.attributes?.url,
      mobileImagePath: guide.attributes.mobileImage?.data?.attributes?.url,
      link: {
        label: 'guideListPage.cardSection.linkLabel', // this is a translations path and it will be translated by the component
        href: `/${productSlug}/guides/${guide.attributes.slug}`,
        translate: true,
      },
    } satisfies GuideCardProps;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(error);
    return null;
  }
}
