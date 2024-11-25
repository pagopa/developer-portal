import {
  BaseProductWithRelationsCodec,
  StrapiProducts,
} from '../codecs/ProductCodec';
import { Product } from '../../types/product';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeProductsProps(
  strapiProducts: StrapiProducts
): ReadonlyArray<Product> {
  return strapiProducts.data.map(makeProductProps);
}

export function makeProductProps(product: StrapiProducts['data'][0]): Product {
  return {
    ...makeBaseProductWithoutLogoProps(product),
    description: product.attributes.description,
    logo: product.attributes.logo?.data.attributes,
  };
}

function getApiDataListPageUrl(
  product: BaseProductWithRelationsCodec
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
  product: BaseProductWithRelationsCodec
): Product {
  return {
    ...product.attributes,
    description: undefined,
    hasApiDataListPage:
      product.attributes.api_data_list_page.data &&
      product.attributes.api_data_list_page.data.attributes.apiData.data
        .length > 0,
    apiDataListPageUrl: getApiDataListPageUrl(product),
    hasTutorialListPage: !!product.attributes.tutorial_list_page,
    hasGuideListPage: !!product.attributes.guide_list_page,
    hasOverviewPage: !!product.attributes.overview,
    hasQuickstartGuidePage: !!product.attributes.quickstart_guide,
    bannerLinks: product.attributes.bannerLinks?.map(makeBannerLinkProps) || [],
  };
}
