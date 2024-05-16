import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { StrapiQuickStarts } from './strapi/quickStarts';
import { products, quickStartGuides } from '@/_contents/products';

export type QuickStartGuidesPageProps = readonly QuickStartGuidePageProps[];

type StaticQuickStarts = typeof quickStartGuides;

export function makeQuickStartsProps(
  strapiQuickStarts: StrapiQuickStarts,
  staticQuickStarts: StaticQuickStarts
): QuickStartGuidesPageProps {
  return [
    ...staticQuickStarts,
    ...strapiQuickStarts.data.map((quickStart) => ({
      abstract: {
        title: quickStart.attributes.title,
        description: `test`,
      },
      defaultStepAnchor:
        quickStart.attributes.quickstartGuideItems.data[0].attributes.anchor,
      product:
        products.find(
          (product) =>
            product.slug === quickStart.attributes.product.data.attributes.slug
        ) || products[0],
      // TODO: implement steps
      // quickStartGuideItems: quickStart.attributes.quickstartGuideItems.data,
      steps: [],
    })),
  ];
}

export const makeQuickStartsPropsFromStatic = (
  staticQuickStarts: StaticQuickStarts
): QuickStartGuidesPageProps => staticQuickStarts;
