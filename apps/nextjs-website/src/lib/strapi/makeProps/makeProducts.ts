import {
  BaseProductWithRelationsCodec,
  StrapiProducts,
} from '../codecs/ProductCodec';
import { Product } from '../../types/product';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';

export function makeProductsProps(
  products: StrapiProducts
): ReadonlyArray<Product> {
  return products.data.map(makeProductProps);
}

export function makeProductProps(product: StrapiProducts['data'][0]): Product {
  return {
    ...product.attributes,
    description: product.attributes.description ?? '',
    logo: product.attributes.logo?.data.attributes,
    hasApiDataListPage:
      product.attributes.api_data_list_page.data &&
      product.attributes.api_data_list_page.data.attributes.apiData.data
        .length > 0,
    apiDataListPageUrl:
      product.attributes.api_data_list_page.data &&
      `/${product.attributes.slug}/api/${
        product.attributes.api_data_list_page.data.attributes.apiData.data[0]
          .attributes.apiRestDetail?.slug ??
        product.attributes.api_data_list_page.data.attributes.apiData.data[0]
          .attributes.apiSoapUrl
      }`,
    hasTutorialListPage: !!product.attributes.tutorial_list_page.data,
    hasGuideListPage: !!product.attributes.guide_list_page.data,
    hasOverviewPage: !!product.attributes.overview.data,
    hasQuickstartGuidePage: !!product.attributes.quickstart_guide.data,
    bannerLinks: product.attributes.bannerLinks?.map(makeBannerLinkProps) || [],
  };
}

export function makeBaseProductWithRelationsCodec(
  product: BaseProductWithRelationsCodec
): Product {
  return {
    ...product.attributes,
    description: '',
    hasApiDataListPage:
      product.attributes.api_data_list_page.data &&
      product.attributes.api_data_list_page.data.attributes.apiData.data
        .length > 0,
    apiDataListPageUrl:
      product.attributes.api_data_list_page.data &&
      `/${product.attributes.slug}/api/${
        product.attributes.api_data_list_page.data.attributes.apiData.data[0]
          .attributes.apiRestDetail?.slug ??
        product.attributes.api_data_list_page.data.attributes.apiData.data[0]
          .attributes.apiSoapUrl
      }`,
    hasTutorialListPage: !!product.attributes.tutorial_list_page,
    hasGuideListPage: !!product.attributes.guide_list_page,
    hasOverviewPage: !!product.attributes.overview,
    hasQuickstartGuidePage: !!product.attributes.quickstart_guide,
    bannerLinks: product.attributes.bannerLinks?.map(makeBannerLinkProps) || [],
  };
}
