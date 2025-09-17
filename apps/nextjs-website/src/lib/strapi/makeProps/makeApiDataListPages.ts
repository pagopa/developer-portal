import { ApiDataListPageTemplateProps } from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import { makeBaseProductWithoutLogoProps } from '@/lib/strapi/makeProps/makeProducts';
import { StrapiApiDataListPages } from '@/lib/strapi/types/apiDataListPages';
import _ from 'lodash';
import { StrapiBaseApiData } from '../types/apiDataList';

function makeApiDataListPageCard(item: StrapiBaseApiData, slug: string) {
  if (
    !item.attributes.title ||
    (!item.attributes.apiRestDetail && !item.attributes.apiSoapDetail) ||
    (!item.attributes.apiRestDetail?.slug &&
      !item.attributes.apiSoapDetail?.slug)
  ) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `Error processing API Data with ID "${item.id}": Missing title or API details. Skipping...`
    );
    return null;
  }

  return {
    tags: [
      {
        label: item.attributes.apiSoapDetail ? 'SOAP' : 'REST'
      }
    ].filter((tag) => !!tag.label),
    title: item?.attributes?.title,
    text: item?.attributes?.description || '',
    icon: item?.attributes?.icon?.data?.attributes.url || '',
    href: `/${slug}/api/${
      item.attributes.apiRestDetail
        ? item.attributes.apiRestDetail?.slug
        : item.attributes.apiSoapDetail?.slug
    }`
  };
}

export function makeApiDataListPagesProps(
  strapiApiDataListPages: StrapiApiDataListPages
): ReadonlyArray<ApiDataListPageTemplateProps> {
  return _.compact(
    strapiApiDataListPages.data.map(({ attributes }) => {
      const slug = attributes.product.data.attributes.slug;
      if (!slug) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error processing API Data List Page with title "${attributes.title}": Missing product slug`
        );
        return null;
      }

      // eslint-disable-next-line functional/no-try-statements
      try {
        return {
          ...attributes,
          hero: {
            title: attributes.title,
            subtitle: attributes.description || ''
          },
          product: makeBaseProductWithoutLogoProps(attributes.product.data),
          apiDetailSlugs: attributes.apiData.data
            .map(({ attributes }) =>
              attributes.apiRestDetail
                ? attributes.apiRestDetail.slug
                : attributes.apiSoapDetail?.slug
            )
            .filter(Boolean) as readonly string[],
          cards: _.compact(
            attributes.apiData.data.map((item) =>
              makeApiDataListPageCard(item, slug)
            )
          ),
          bannerLinks: attributes.bannerLinks.map(makeBannerLinkProps),
          seo: attributes.seo,
          updatedAt: attributes.updatedAt
        };
      } catch (error) {
        // eslint-disable-next-line functional/no-expression-statements
        console.error(
          `Error processing API Data List Page with title "${attributes.title}":`,
          error
        );
        return null;
      }
    })
  );
}
