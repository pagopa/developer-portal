import { StrapiProducts } from '@/lib/strapi/types/product';
import {
  strapiProduct,
  strapiProductMinimal,
  strapiProductWithoutLogo,
  productWithMissingMandatoryFields,
} from '@/lib/strapi/__tests__/factories/product';

export function productsWithMixedData(): StrapiProducts {
  return {
    data: [strapiProduct(), strapiProductMinimal(), strapiProductWithoutLogo()],
  };
}

export function productsWithInvalidData(): StrapiProducts {
  return {
    data: [productWithMissingMandatoryFields() as any],
  };
}

export function emptyProductsCollection(): StrapiProducts {
  return {
    data: [],
  };
}

export function singleProductCollection(): StrapiProducts {
  return {
    data: [strapiProduct()],
  };
}

export function productsWithoutLogos(): StrapiProducts {
  return {
    data: [
      strapiProductWithoutLogo(),
      {
        attributes: {
          ...strapiProductWithoutLogo().attributes,
          name: 'Second Product Without Logo',
          slug: 'second-product-without-logo',
          shortName: 'SP2',
        },
      },
    ],
  };
}

export function productsWithoutBannerLinks(): StrapiProducts {
  return {
    data: [
      {
        attributes: {
          ...strapiProduct().attributes,
          bannerLinks: undefined,
        },
      },
      {
        attributes: {
          ...strapiProduct().attributes,
          name: 'Product Without Banner Links',
          slug: 'product-without-banner-links',
          shortName: 'PWBL',
          bannerLinks: [],
        },
      },
    ],
  };
}

export function productsWithMinimalRelations(): StrapiProducts {
  return {
    data: [
      {
        attributes: {
          ...strapiProduct().attributes,
          overview: { data: undefined },
          quickstart_guide: { data: undefined },
          api_data_list_page: { data: undefined },
          tutorial_list_page: { data: undefined },
          guide_list_page: { data: undefined },
          release_note: { data: undefined },
        },
      },
    ],
  };
}
