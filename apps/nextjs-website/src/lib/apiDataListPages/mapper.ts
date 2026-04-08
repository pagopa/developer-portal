/* eslint-disable functional/no-expression-statements */
import { mapBannerLinkProps } from '@/lib/bannerLink/mapper';
import { makeBaseProductWithoutLogoProps } from '@/lib/products/mapper';
import { ApiDataListPages, ApiDataListPageTemplateProps } from './types';
import { compact } from 'lodash';
import { BaseApiData } from '@/lib/apiDataList/types';

const mapApiDataListPageCard =
  (locale: string, slug: string) => (item: BaseApiData) => {
    if (!item.apiRestDetail && !item.apiSoapDetail) {
      console.error(
        `Error while processing API Data with title "${item.title}": missing API details. Skipping...`
      );
      return null;
    }

    if (!item.apiRestDetail?.slug && !item.apiSoapDetail?.slug) {
      console.error(`
      Error while processing API Data with title "${item.title}": missing API slug. Skipping...`);
      return null;
    }

    return {
      labels: [
        {
          label: item.apiSoapDetail ? 'SOAP' : 'REST',
        },
      ].filter((label) => !!label.label),
      title: item?.title,
      text: item?.description || '',
      icon: item?.icon?.url || undefined,
      href: `/${locale}/${slug}/api/${
        item.apiRestDetail ? item.apiRestDetail?.slug : item.apiSoapDetail?.slug
      }`,
      tags: item.tags || [],
    };
  };

export function mapApiDataListPages(
  locale: string,
  strapiApiDataListPages: ApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return compact(
    strapiApiDataListPages.data.map((apiPage) => {
      const slug = apiPage.product.slug;
      if (!slug) {
        console.error(
          `Error while processing API Data List Page with title "${apiPage.title}": missing product slug. Skipping...`
        );
        return null;
      }

      // eslint-disable-next-line functional/no-try-statements
      try {
        const product = makeBaseProductWithoutLogoProps(
          locale,
          apiPage.product
        );
        return {
          ...apiPage,
          hero: {
            title: apiPage.title,
            subtitle: apiPage.description || '',
          },
          product,
          apiData: apiPage.api_data,
          apiDetailSlugs: compact(
            apiPage.api_data.map((item) =>
              item.apiRestDetail
                ? item.apiRestDetail.slug
                : item.apiSoapDetail?.slug
            )
          ),
          cards: compact(
            apiPage.api_data.map(mapApiDataListPageCard(locale, slug))
          ),
          bannerLinks: apiPage.bannerLinks.map(mapBannerLinkProps),
          seo: apiPage.seo,
          updatedAt: apiPage.updatedAt,
          enableFilters: apiPage.enableFilters,
          tags: product.tags,
        } as unknown as ApiDataListPageTemplateProps;
      } catch (error) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error while processing API Data List Page with title "${apiPage.title}":`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}
