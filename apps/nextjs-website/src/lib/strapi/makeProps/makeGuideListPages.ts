import { GuideListPageProps } from '@/app/[productSlug]/guides/page';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from './makeProducts';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import { BaseGuide } from '@/lib/strapi/types/guide';
import _ from 'lodash';
import { StrapiGuideListPaginated } from '@/lib/strapi/types/guideList';

export function makeGuideListPagesProps(
  strapiGuideListPages: StrapiGuideListPaginated
): readonly GuideListPageProps[] {
  return strapiGuideListPages.data.map(({ attributes }) => {
    const product = makeBaseProductWithoutLogoProps(attributes.product.data);
    const guidesSections: readonly GuidesSectionProps[] = [
      ...attributes.guidesByCategory.map(({ category, guides }) => ({
        title: category,
        guides: _.compact(
          guides.data.map((guide) => makeGuideCardProps(guide, product.slug))
        ),
      })),
    ];
    return {
      path: `/${attributes.product.data.attributes.slug}/guides`,
      product,
      abstract: {
        title: attributes.title,
        description: attributes.description,
      },
      guidesSections: [...guidesSections],
      bannerLinks:
        attributes.bannerLinks.length > 0
          ? attributes.bannerLinks.map(makeBannerLinkProps)
          : attributes.product.data.attributes.bannerLinks?.map(
              makeBannerLinkProps
            ),
      seo: attributes.seo || undefined,
      updatedAt: attributes.updatedAt.toISOString(),

    } satisfies GuideListPageProps;
  });
}

function makeGuideCardProps(
  guide: BaseGuide,
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
