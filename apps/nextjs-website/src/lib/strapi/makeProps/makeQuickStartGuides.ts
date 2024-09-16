import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { StrapiQuickStartGuides } from '../codecs/QuickStartGuidesCodec';
import { quickStartGuides } from '@/_contents/products';
import { Part } from '../../types/part';
import { Step } from '../../types/step';
import { partFromStrapiPart } from '../codecs/PartCodec';
import { mergeProductWithStaticContent } from './makeProducts';

export type QuickStartGuidesPageProps = readonly QuickStartGuidePageProps[];

type StaticQuickStarts = typeof quickStartGuides;

type QuickstartGuideItem =
  StrapiQuickStartGuides['data'][0]['attributes']['quickstartGuideItems']['data'][0];

function makeStepFromQuickstartGuideItems(item: QuickstartGuideItem): Step {
  return {
    anchor: item.attributes.anchor,
    title: item.attributes.title,
    parts: item.attributes.parts
      .map((part) => partFromStrapiPart(part))
      .filter((part) => !!part) as ReadonlyArray<Part>,
  };
}

export function makeQuickStartGuidesProps(
  strapiQuickStarts: StrapiQuickStartGuides,
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
          makeStepFromQuickstartGuideItems(item)
        ),
        path: `/${product.slug}/quick-start`,
      };
    }),
    ...staticQuickStarts,
  ];
}

export const makeQuickStartGuidesPropsFromStatic = (
  staticQuickStarts: StaticQuickStarts
): QuickStartGuidesPageProps => staticQuickStarts;