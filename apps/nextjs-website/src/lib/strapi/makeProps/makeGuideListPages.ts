import { GuideListPageProps } from '@/app/[productSlug]/guides/page';
import { StrapiGuideListPages } from '../codecs/GuideListPagesCodec';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';
import { mergeProductWithStaticContent } from '@/lib/strapi/makeProps/makeProducts';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

type StaticGuideListPages = readonly GuideListPageProps[];

export function makeGuideListPagesProps(
  strapiGuideListPages: StrapiGuideListPages,
  staticGuideListPages: StaticGuideListPages
): readonly GuideListPageProps[] {
  return [
    ...strapiGuideListPages.data.map(({ attributes }) => {
      const product = mergeProductWithStaticContent(
        attributes.product.data.attributes
      );
      const guidesSections: readonly GuidesSectionProps[] = [
        ...attributes.guidesByCategory.map(({ category, guides }) => ({
          title: category,
          guides: guides.data.map(({ attributes }) => ({
            title: attributes.title,
            description: {
              title: 'guideListPage.cardSection.listItemsTitle', // this is translations path and it will be translated by the component
              listItems: attributes.listItems.map(({ text }) => text),
            },
            imagePath: attributes.image.data.attributes.url,
            mobileImagePath: attributes.mobileImage.data.attributes.url,
            link: {
              label: 'guideListPage.cardSection.linkLabel', // this is translations path and it will be translated by the component
              href: `/${product.slug}/guides/${attributes.slug}`,
            },
          })),
        })),
      ];
      return {
        name: attributes.title,
        path: `/${product.slug}/guides`,
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
        seo: attributes.seo,
      };
    }),
    ...staticGuideListPages,
  ];
}
