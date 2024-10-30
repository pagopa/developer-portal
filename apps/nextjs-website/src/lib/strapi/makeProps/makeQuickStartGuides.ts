import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { StrapiQuickStartGuides } from '../codecs/QuickStartGuidesCodec';
import { Part } from '../../types/part';
import { Step } from '../../types/step';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithRelationsCodec } from './makeProducts';

export type QuickStartGuidesPageProps = readonly QuickStartGuidePageProps[];

type QuickstartGuideItem =
  StrapiQuickStartGuides['data'][0]['attributes']['quickstartGuideItems']['data'][0];

function makeStepFromQuickstartGuideItems(item: QuickstartGuideItem): Step {
  return {
    anchor: item.attributes.anchor,
    title: item.attributes.title,
    parts: item.attributes.parts
      .map((part) => makePartProps(part))
      .filter((part) => !!part) as ReadonlyArray<Part>,
  };
}

export function makeQuickStartGuidesProps(
  strapiQuickStarts: StrapiQuickStartGuides
): QuickStartGuidesPageProps {
  return strapiQuickStarts.data.map((quickStart) => {
    return {
      abstract: {
        title: quickStart.attributes.title,
        description: quickStart.attributes.description,
      },
      defaultStepAnchor:
        quickStart.attributes.quickstartGuideItems.data[0].attributes.anchor,
      product: makeBaseProductWithRelationsCodec(
        quickStart.attributes.product.data
      ),
      steps: quickStart.attributes.quickstartGuideItems.data.map((item) =>
        makeStepFromQuickstartGuideItems(item)
      ),
      path: `/${quickStart.attributes.product.data.attributes.slug}/quick-start`,
      bannerLinks:
        quickStart.attributes.bannerLinks.length > 0
          ? quickStart.attributes.bannerLinks.map(makeBannerLinkProps)
          : quickStart.attributes.product.data.attributes.bannerLinks?.map(
              makeBannerLinkProps
            ),
      seo: quickStart.attributes.seo,
    };
  });
}
