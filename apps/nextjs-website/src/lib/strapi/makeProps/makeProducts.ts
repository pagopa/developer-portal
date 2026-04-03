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
  locale: string,
  strapiProducts: StrapiProducts
): ReadonlyArray<Product> {
  return compact(
    strapiProducts.data.map((product) => makeProductProps(locale, product))
  );
}

export function makeProductProps(
  locale: string,
  product: StrapiProduct
): Product | null {
  if (!product) {
    console.error('Invalid product data:', product);
    return null;
  }
  if (!product.slug || !product.name) {
    console.error(
      `Error while processing Product: missing title or slug. Title: ${product.name} | Slug: ${product.slug}. Skipping...`
    );
    return null;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
    return {
      ...makeBaseProductWithoutLogoProps(locale, product),
      description: product.description,
      logo: product.logo,
    };
  } catch (error) {
    console.error(
      `Error while processing Product with name "${product.name}":`,
      error,
      'Skipping...'
    );
    return null;
  }
}

function getApiDataListPageUrl(
  locale: string,
  product: StrapiBaseProductWithRelations
): string | undefined {
  const apiDataList = product.api_data_list_page;
  // if there is no api data, return undefined
  if (!apiDataList || apiDataList.api_data.length === 0) return;

  const productSlug = product.slug;
  const apiData = apiDataList.api_data[0];

  if (
    apiDataList &&
    apiDataList.api_data.length === 1 &&
    apiData.apiRestDetail?.slug
  ) {
    return `/${locale}/${productSlug}/api/${apiData.apiRestDetail.slug}`;
  }

  return `/${locale}/${productSlug}/api`;
}

export function makeBaseProductWithoutLogoProps(
  locale: string,
  product: StrapiBaseProductWithRelations
): Product {
  if (!product.slug) {
    throw new Error(
      `Error while processing Product with name "${product.name}": missing slug. Skipping...`
    );
  }

  return {
    apiDataListPageUrl: getApiDataListPageUrl(locale, product),
    bannerLinks: product.bannerLinks?.map(makeBannerLinkProps) || [],
    isVisible: product.isVisible,
    hasApiDataListPage: !!(
      product.api_data_list_page &&
      product.api_data_list_page.api_data.length > 0
    ),
    hasGuideListPage: !!product.guide_list_page,
    hasOverviewPage: !!product.overview,
    hasQuickstartGuidePage: !!product.quickstart_guide,
    hasReleaseNotePage: !!product.release_note,
    hasTutorialListPage: !!product.tutorial_list_page,
    hasUseCaseListPage: !!product.use_case_list_page,
    name: product.name,
    shortName: product.shortName,
    slug: product.slug,
    tags: product.tags?.map((tag) => tag) || [],
  } satisfies Product;
}
