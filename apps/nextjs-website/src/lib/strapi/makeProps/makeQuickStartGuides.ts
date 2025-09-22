/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { QuickStartGuidePageData } from '@/app/[productSlug]/quick-start/page';
import { PartData } from '@/lib/types/part';
import { Step } from '@/lib/types/step';
import { makePart } from '@/lib/strapi/makeProps/makePart';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiPart } from '@/lib/strapi/types/part';
import {
  StrapiQuickStartGuideItem,
  StrapiQuickStartGuides,
} from '@/lib/strapi/types/quickStartGuides';
import { compact } from 'lodash';

export type QuickStartGuidesPage = readonly QuickStartGuidePageData[];

function makeStepFromQuickstartGuideItems(
  item: StrapiQuickStartGuideItem
): Step {
  return {
    anchor: item.attributes.anchor,
    title: item.attributes.title,
    parts: item.attributes.parts
      .map((part) => makePart(part as StrapiPart))
      .filter((part) => !!part) as ReadonlyArray<PartData>,
  };
}

export function makeQuickStartGuides(
  strapiQuickStarts: StrapiQuickStartGuides
): QuickStartGuidesPage {
  return compact(
    strapiQuickStarts.data.map((quickStart) => {
      if (!quickStart.attributes.product.data?.attributes.slug) {
        console.error(
          `Error while processing QuickStartGuide with id ${quickStart.id}: missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          abstract: {
            title: quickStart.attributes.title,
            description: quickStart.attributes.description,
          },
          updatedAt: quickStart.attributes.updatedAt,
          defaultStepAnchor:
            quickStart.attributes.quickstartGuideItems.data[0].attributes
              .anchor,
          product: makeBaseProductWithoutLogo(
            quickStart.attributes.product.data
          ),
          steps: quickStart.attributes.quickstartGuideItems.data.map((item) =>
            makeStepFromQuickstartGuideItems(item)
          ),
          path: `/${quickStart.attributes.product.data.attributes.slug}/quick-start`,
          bannerLinks:
            quickStart.attributes.bannerLinks.length > 0
              ? quickStart.attributes.bannerLinks.map(makeBannerLink)
              : quickStart.attributes.product.data.attributes.bannerLinks?.map(
                  makeBannerLink
                ),
          seo: quickStart.attributes.seo,
        } satisfies QuickStartGuidePageData;
      } catch (error) {
        console.error(
          `Error while processing QuickStartGuide with id ${quickStart.id}:`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}
