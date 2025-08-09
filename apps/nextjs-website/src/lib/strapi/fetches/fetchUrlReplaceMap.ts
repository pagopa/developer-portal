import { deprecatedFetchFromStrapi } from '../fetchFromStrapi';
import { UrlReplaceMapCodec } from '../codecs/UrlReplaceMapCodec';
import qs from 'qs';

const makeStrapiUrlReplaceMapPopulate = () =>
  qs.stringify({
    populate: {
      urlToGuide: {
        populate: {
          guide: {
            populate: ['product'],
          },
        },
      },
    },
  });

export const fetchUrlReplaceMap = deprecatedFetchFromStrapi(
  'url-replace-map',
  makeStrapiUrlReplaceMapPopulate(),
  UrlReplaceMapCodec
);
