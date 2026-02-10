/* eslint-disable functional/no-expression-statements */
import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';
import { compact } from 'lodash';
import { StrapiBaseApiData } from '../types/apiDataList';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

function makeApiDataListPageCard(item: StrapiBaseApiData, slug: string) {
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
    icon: item?.icon?.url || '',
    href: `/${slug}/api/${
      item.apiRestDetail ? item.apiRestDetail?.slug : item.apiSoapDetail?.slug
    }`,
    tags: item.tags?.map((tag) => tag) || [],
  };
}

export function makeApiDataListPagesProps(
  strapiApiDataListPages: RootEntity<StrapiApiDataListPages>
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return compact(
    strapiApiDataListPages.data.map((attributes) => {
      const slug = attributes.product?.slug;
      if (!slug) {
        console.error(
          `Error while processing API Data List Page with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      // eslint-disable-next-line functional/no-try-statements
      try {
        const product = makeBaseProductWithoutLogoProps(attributes.product);
        return {
          ...attributes,
          hero: {
            title: attributes.title,
            subtitle: attributes.description || '',
          },
          product,
          apiDetailSlugs: compact(
            attributes.api_data.map((attributes) =>
              attributes.apiRestDetail
                ? attributes.apiRestDetail.slug
                : attributes.apiSoapDetail?.slug
            )
          ),
          cards: compact(
            attributes.api_data.map((item) =>
              makeApiDataListPageCard(item, slug)
            )
          ),
          bannerLinks: attributes.bannerLinks.map(makeBannerLinkProps),
          seo: attributes.seo,
          updatedAt: attributes.updatedAt,
          enableFilters: attributes.enableFilters,
          tags: product.tags,
        };
      } catch (error) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error while processing API Data List Page with title "${attributes.title}":`,
          error,
          'Skipping...'
        );
        return null;
      }
    })
  );
}
