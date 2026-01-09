/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { Step } from '@/lib/types/step';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import {
  StrapiQuickStartGuideItem,
  StrapiQuickStartGuides,
} from '@/lib/strapi/types/quickStartGuides';
import { compact } from 'lodash';

export type QuickStartGuidesPageProps = readonly QuickStartGuidePageProps[];

function makeStepFromQuickstartGuideItems(
  item: StrapiQuickStartGuideItem
): Step {
  return {
    anchor: item.attributes.anchor,
    title: item.attributes.title,
    parts: compact(item.attributes.parts.map((part) => makePartProps(part))),
  };
}

export function makeQuickStartGuidesProps(
  strapiQuickStarts: StrapiQuickStartGuides
): QuickStartGuidesPageProps {
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
          product: makeBaseProductWithoutLogoProps(
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
        } satisfies QuickStartGuidePageProps;
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
