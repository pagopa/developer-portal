import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { StrapiQuickStarts } from './strapi/quickStarts';
import { products, quickStartGuides } from '@/_contents/products';
import { Part } from './types/part';
import { Step } from './types/step';
import { partFromStrapiPart } from './strapi/codecs/PartCodec';

export type QuickStartGuidesPageProps = readonly QuickStartGuidePageProps[];

type StaticQuickStarts = typeof quickStartGuides;

type QuickstartGuideItem =
  StrapiQuickStarts['data'][0]['attributes']['quickstartGuideItems']['data'][0];

function stepFromQuickstartGuideItems(item: QuickstartGuideItem): Step {
  return {
    anchor: item.attributes.anchor,
    title: item.attributes.title,
    parts: item.attributes.parts
      .map((part) => partFromStrapiPart(part))
      .filter((part) => !!part) as ReadonlyArray<Part>,
  };
}

export function makeQuickStartsProps(
  strapiQuickStarts: StrapiQuickStarts,
  staticQuickStarts: StaticQuickStarts
): QuickStartGuidesPageProps {
  return [
    ...strapiQuickStarts.data.map((quickStart) => ({
      abstract: {
        title: quickStart.attributes.title,
        description: quickStart.attributes.description,
      },
      defaultStepAnchor:
        quickStart.attributes.quickstartGuideItems.data[0].attributes.anchor,
      product:
        products.find(
          (product) =>
            product.slug === quickStart.attributes.product.data.attributes.slug
        ) || products[0],
      steps: quickStart.attributes.quickstartGuideItems.data.map((item) =>
        stepFromQuickstartGuideItems(item)
      ),
    })),
    ...staticQuickStarts,
  ];
}

export const makeQuickStartsPropsFromStatic = (
  staticQuickStarts: StaticQuickStarts
): QuickStartGuidesPageProps => staticQuickStarts;
