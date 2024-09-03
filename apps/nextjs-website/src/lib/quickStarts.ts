import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { StrapiQuickStarts } from './strapi/quickStarts';
import { quickStartGuides } from '@/_contents/products';
import { Part } from './types/part';
import { Step } from './types/step';
import { partFromStrapiPart } from './strapi/codecs/PartCodec';
import { mergeProductWithStaticContent } from './products';

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
    ...strapiQuickStarts.data.map((quickStart) => {
      const product = mergeProductWithStaticContent(
        quickStart.attributes.product.data.attributes
      );
      return {
        abstract: {
          title: quickStart.attributes.title,
          description: quickStart.attributes.description,
        },
        defaultStepAnchor:
          quickStart.attributes.quickstartGuideItems.data[0].attributes.anchor,
        product: product,
        steps: quickStart.attributes.quickstartGuideItems.data.map((item) =>
          stepFromQuickstartGuideItems(item)
        ),
        path: `/${product.slug}/quick-start`,
      };
    }),
    ...staticQuickStarts,
  ];
}

export const makeQuickStartsPropsFromStatic = (
  staticQuickStarts: StaticQuickStarts
): QuickStartGuidesPageProps => staticQuickStarts;
