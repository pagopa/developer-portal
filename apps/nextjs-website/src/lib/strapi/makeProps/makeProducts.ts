/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-throw-statements */
import { Product } from '@/lib/types/product';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import {
  StrapiBaseProductWithRelations,
  StrapiProduct,
  StrapiProducts,
} from '@/lib/strapi/types/product';
import { compact } from 'lodash';

export function makeProductsProps(
  strapiProducts: StrapiProducts
): ReadonlyArray<Product> {
  return compact(strapiProducts.data.map(makeProductProps));
}

export function makeProductProps(product: StrapiProduct): Product | null {
  if (!product || !product.attributes) {
    console.error('Invalid product data:', product);
    return null;
  }

  if (!product.attributes.slug || !product.attributes.name) {
    console.error(
      `Error while processing Product: missing title or slug. Title: ${product.attributes.name} | Slug: ${product.attributes.slug}. Skipping...`
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
    console.error(
      `Error while processing Product with name "${product.attributes.name}":`,
      error,
      'Skipping...'
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
      `Error while processing Product with name "${product.attributes.name}": missing slug. Skipping...`
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
    hasUseCaseListPage: !!product.attributes.use_case_list_page.data,
    bannerLinks: product.attributes.bannerLinks?.map(makeBannerLinkProps) || [],
    tags: product.attributes.tags?.data?.map((tag) => tag.attributes) || [],
  } satisfies Product;
}
