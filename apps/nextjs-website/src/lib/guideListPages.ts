import { GuidesPageProps } from '@/app/[productSlug]/guides/page';
import { StrapiGuideListPages } from './strapi/guideListCodec';
import { products } from '@/_contents/products';
import { makeProductFromAttributes } from './products';
import { GuidesSectionProps } from '@/components/molecules/GuidesSection/GuidesSection';

type StaticGuideListPages = readonly GuidesPageProps[];

export function makeGuideListPagesProps(
  strapiGuideListPages: StrapiGuideListPages,
  staticGuideListPages: StaticGuideListPages
): readonly GuidesPageProps[] {
  return [
    ...strapiGuideListPages.data.map(({ attributes }) => {
      const product = makeProductFromAttributes(
        attributes.product.data.attributes,
        products
      );
      const guidesSections: readonly GuidesSectionProps[] = [
        ...attributes.guidesByCategory.map(({ category, guides }) => ({
          title: category,
          guides: guides.data.map(({ attributes }) => ({
            title: attributes.title,
            description: {
              title: 'guideListPage.cardSection.listItemsTitle', // this is translations path and it will be tranlated by the component
              listItems: attributes.listItems.map(({ text }) => text),
            },
            imagePath: attributes.image.data.attributes.url,
            mobileImagePath: attributes.mobileImage.data.attributes.url,
            link: {
              label: 'guideListPage.cardSection.linkLabel', // this is translations path and it will be tranlated by the component
              href: `${product.slug}/guides/${attributes.slug}`,
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
        bannerLinks: product.bannerLinks,
      };
    }),
    ...staticGuideListPages,
  ];
}
