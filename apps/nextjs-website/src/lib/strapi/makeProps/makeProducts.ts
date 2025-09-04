/* eslint-disable functional/no-throw-statements */
import { Product } from '@/lib/types/product';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import {
  StrapiBaseProductWithRelations,
  StrapiProduct,
  StrapiProducts,
} from '@/lib/strapi/types/product';
import _ from 'lodash';

export function makeProductsProps(
  strapiProducts: StrapiProducts
): ReadonlyArray<Product> {
  return _.compact(strapiProducts.data.map(makeProductProps));
}

export function makeProductProps(product: StrapiProduct): Product | null {
  if (!product || !product.attributes) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Invalid product data:', product);
    return null;
  }

  if (!product.attributes.slug) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `Product with id ${product.attributes.name} is missing a slug`
    );
    return null;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
    return {
      ...makeBaseProductWithoutLogoProps(product),
      description: product.attributes.description,
      logo: product.attributes.logo?.data.attributes,
    };
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `Error while mapping product with id ${product.attributes.name}:`,
      error
    );
    return null;
  }
}

function getApiDataListPageUrl(
  product: StrapiBaseProductWithRelations
): string | undefined {
  const apiDataList = product.attributes.api_data_list_page.data;
  // if there is no api data, return undefined
  if (!apiDataList || apiDataList.attributes.apiData.data.length === 0) return;

  const productSlug = product.attributes.slug;
  const apiData = apiDataList.attributes.apiData.data[0];

  if (
    apiDataList &&
    apiDataList.attributes.apiData.data.length === 1 &&
    apiData.attributes.apiRestDetail?.slug
  ) {
    return `/${productSlug}/api/${apiData.attributes.apiRestDetail.slug}`;
  }

  return `/${productSlug}/api`;
}

export function makeBaseProductWithoutLogoProps(
  product: StrapiBaseProductWithRelations
): Product {
  if (!product.attributes.slug) {
    throw new Error(
      `Product with id ${product.attributes.name} is missing a slug`
    );
  }

  return {
    slug: product.attributes.slug,
    name: product.attributes.name,
    shortName: product.attributes.shortName,
    hasApiDataListPage: !!(
      product.attributes.api_data_list_page.data &&
      product.attributes.api_data_list_page.data.attributes.apiData.data
        .length > 0
    ),
    apiDataListPageUrl: getApiDataListPageUrl(product),
    hasTutorialListPage: !!product.attributes.tutorial_list_page.data,
    hasGuideListPage: !!product.attributes.guide_list_page.data,
    hasOverviewPage: !!product.attributes.overview.data,
    hasQuickstartGuidePage: !!product.attributes.quickstart_guide.data,
    hasReleaseNotePage: !!product.attributes.release_note.data,
    bannerLinks: product.attributes.bannerLinks?.map(makeBannerLinkProps) || [],
  } satisfies Product;
}
