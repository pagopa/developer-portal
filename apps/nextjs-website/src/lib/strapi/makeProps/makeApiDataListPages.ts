/* eslint-disable functional/no-expression-statements */
import { ApiDataListPageTemplateData } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { makeBannerLink } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogo } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';
import { compact } from 'lodash';
import { StrapiBaseApiData } from '../types/apiDataList';

function makeApiDataListPageCard(item: StrapiBaseApiData, slug: string) {
  if (!item.attributes.apiRestDetail && !item.attributes.apiSoapDetail) {
    console.error(
      `Error while processing API Data with title "${item.attributes.title}": missing API details. Skipping...`
    );
    return null;
  }

  if (
    !item.attributes.apiRestDetail?.slug &&
    !item.attributes.apiSoapDetail?.slug
  ) {
    console.error(`
      Error while processing API Data with title "${item.attributes.title}": missing API slug. Skipping...`);
    return null;
  }

  return {
    tags: [
      {
        label: item.attributes.apiSoapDetail ? 'SOAP' : 'REST',
      },
    ].filter((tag) => !!tag.label),
    title: item?.attributes?.title,
    text: item?.attributes?.description || '',
    icon: item?.attributes?.icon?.data?.attributes.url || '',
    href: `/${slug}/api/${
      item.attributes.apiRestDetail
        ? item.attributes.apiRestDetail?.slug
        : item.attributes.apiSoapDetail?.slug
    }`,
  };
}

export function makeApiDataListPages(
  strapiApiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateData> {
  return compact(
    strapiApiDataListPages.data.map(({ attributes }) => {
      const slug = attributes.product.data?.attributes.slug;
      if (!slug) {
        console.error(
          `Error while processing API Data List Page with title "${attributes.title}": missing product slug. Skipping...`
        );
        return null;
      }

      // eslint-disable-next-line functional/no-try-statements
      try {
        return {
          ...attributes,
          hero: {
            title: attributes.title,
            subtitle: attributes.description || '',
          },
          product: makeBaseProductWithoutLogo(attributes.product.data),
          apiDetailSlugs: attributes.apiData.data
            .map(({ attributes }) =>
              attributes.apiRestDetail
                ? attributes.apiRestDetail.slug
                : attributes.apiSoapDetail?.slug
            )
            .filter(Boolean) as readonly string[],
          cards: compact(
            attributes.apiData.data.map((item) =>
              makeApiDataListPageCard(item, slug)
            )
          ),
          bannerLinks: attributes.bannerLinks.map(makeBannerLink),
          seo: attributes.seo,
          updatedAt: attributes.updatedAt,
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
