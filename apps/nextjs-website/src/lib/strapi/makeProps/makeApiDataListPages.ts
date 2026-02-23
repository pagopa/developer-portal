/* eslint-disable functional/no-expression-statements */
import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';
import { compact } from 'lodash';
import { StrapiBaseApiData } from '../types/apiDataList';

function makeApiDataListPageCard(
  locale: string,
  item: StrapiBaseApiData,
  slug: string
) {
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
    labels: [
      {
        label: item.attributes.apiSoapDetail ? 'SOAP' : 'REST',
      },
    ].filter((label) => !!label.label),
    title: item?.attributes?.title,
    text: item?.attributes?.description || '',
    icon: item?.attributes?.icon?.data?.attributes.url || undefined,
    href: `/${locale}/${slug}/api/${
      item.attributes.apiRestDetail
        ? item.attributes.apiRestDetail?.slug
        : item.attributes.apiSoapDetail?.slug
    }`,
    tags: item.attributes.tags.data?.map((tag) => tag.attributes) || [],
  };
}

export function makeApiDataListPagesProps(
  locale: string,
  strapiApiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
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
        const product = makeBaseProductWithoutLogoProps(
          locale,
          attributes.product.data
        );
        return {
          ...attributes,
          hero: {
            title: attributes.title,
            subtitle: attributes.description || '',
          },
          product,
          apiDetailSlugs: compact(
            attributes.apiData.data.map(({ attributes }) =>
              attributes.apiRestDetail
                ? attributes.apiRestDetail.slug
                : attributes.apiSoapDetail?.slug
            )
          ),
          cards: compact(
            attributes.apiData.data.map((item) =>
              makeApiDataListPageCard(locale, item, slug)
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
