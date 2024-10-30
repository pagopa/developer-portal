import { GuideListPageProps } from '@/app/[productSlug]/guides/page';
import { StrapiGuideListPages } from '../codecs/GuideListPagesCodec';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithRelationsCodec } from './makeProducts';

export function makeGuideListPagesProps(
  strapiGuideListPages: StrapiGuideListPages
): readonly GuideListPageProps[] {
  return strapiGuideListPages.data.map(({ attributes }) => {
    const product = makeBaseProductWithRelationsCodec(
      attributes.product.data
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
      seo: attributes.seo,
    };
  });
}
