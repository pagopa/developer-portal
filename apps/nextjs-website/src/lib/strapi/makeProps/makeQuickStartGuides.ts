/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { QuickStartGuidePageProps } from '@/app/[productSlug]/quick-start/page';
import { Step } from '@/lib/types/step';
import { makePartProps } from '@/lib/strapi/makeProps/makePart';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiPart } from '@/lib/strapi/types/part';
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
    anchor: item.anchor,
    title: item.title,
    parts: compact(item.parts.map((part) => makePartProps(part))),
  };
}

export function makeQuickStartGuidesProps(
  strapiQuickStarts: StrapiQuickStartGuides
): QuickStartGuidesPageProps {
  return compact(
    strapiQuickStarts.data.map((quickStart) => {
      if (!quickStart.product.data?.slug) {
        console.error(
          `Error while processing QuickStartGuide with id ${quickStart.id}: missing product slug. Skipping...`
        );
        return null;
      }

      try {
        return {
          abstract: {
            title: quickStart.title,
            description: quickStart.description,
          },
          updatedAt: quickStart.updatedAt,
          defaultStepAnchor: quickStart.quickstartGuideItems.data[0].anchor,
          product: makeBaseProductWithoutLogoProps(quickStart.product.data),
          steps: quickStart.quickstartGuideItems.data.map((item) =>
            makeStepFromQuickstartGuideItems(item)
          ),
          path: `/${quickStart.product.data.slug}/quick-start`,
          bannerLinks:
            quickStart.bannerLinks.length > 0
              ? quickStart.bannerLinks.map(makeBannerLinkProps)
              : quickStart.product.data.bannerLinks?.map(makeBannerLinkProps),
          seo: quickStart.seo,
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
