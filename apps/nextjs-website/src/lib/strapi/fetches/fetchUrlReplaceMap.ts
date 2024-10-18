import { fetchFromStrapi } from '../fetchFromStrapi';
import { UrlReplaceMapCodec } from '../codecs/UrlReplaceMapCodec';
import qs from 'qs';

const makeStrapiUrlReplaceMapPopulate = () =>
  qs.stringify({
    populate: {
      urlToGuide: {
        populate: {
          guide: {
            populate: [
              'image',
              'mobileImage',
              'listItems',
              'versions',
              'bannerLinks.icon',
              'seo',
              'seo.metaSocial.image',
              'product.logo',
              'product.bannerLinks.icon',
            ],
          },
        },
      },
    },
  });

export const fetchUrlReplaceMap = fetchFromStrapi(
  'url-replace-map',
  makeStrapiUrlReplaceMapPopulate(),
  UrlReplaceMapCodec
);
