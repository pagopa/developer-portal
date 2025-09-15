/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { GuideDefinition } from "@/helpers/makeDocs.helpers";
import { makeBannerLinkProps } from "@/lib/strapi/makeProps/makeBannerLink";
import { makeBaseProductWithoutLogoProps } from "./makeProducts";
import { StrapiGuides } from "@/lib/strapi/types/guide";
import _ from "lodash";

export function makeGuidesProps(
  strapiGuides: StrapiGuides,
): readonly GuideDefinition[] {
  return _.compact(
    strapiGuides.data.map(({ attributes }) => {
      if (!attributes.slug) {
        console.error("guide slug is missing:", attributes);
        return null;
      }

      if (!attributes.product.data.attributes.slug) {
        console.error("product slug is missing:", attributes.product.data);
        return null;
      }

      try {
        const product = makeBaseProductWithoutLogoProps(
          attributes.product.data,
        );
        return {
          product,
          guide: {
            name: attributes.title,
            slug: attributes.slug,
          },
          versions: attributes.versions,
          bannerLinks:
            attributes.bannerLinks.length > 0
              ? attributes.bannerLinks.map(makeBannerLinkProps)
              : attributes.product.data.attributes.bannerLinks?.map(
                  makeBannerLinkProps,
                ) || [],
          seo: attributes.seo,
        };
      } catch (error) {
        console.error(
          "error creating guide definition for:",
          attributes,
          error,
        );
        return null;
      }
    }),
  );
}
