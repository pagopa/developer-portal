import { fetchFromStrapi } from '../fetchFromStrapi';
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

export const fetchUrlReplaceMap = (locale?: string) =>
  fetchFromStrapi(
    'url-replace-map',
    makeStrapiUrlReplaceMapPopulate(),
    UrlReplaceMapCodec,
    locale
  );
