import { fetchFromStrapi } from '../fetchFromStrapi';
import { UrlReplaceMapCodec } from '../codecs/UrlReplaceMapCodec';
import qs from 'qs';

const makeStrapiUrlReplaceMapPopulate = () =>
  qs.stringify({
    populate: [
      'urlToGuide.guide.*',
      'urlToGuide.guide.image',
      'urlToGuide.guide.mobileImage',
      'urlToGuide.guide.listItems',
      'urlToGuide.guide.product.*',
      'urlToGuide.guide.versions.*',
      'urlToGuide.guide.seo.*',
      'urlToGuide.guide.product.bannerLinks.*',
      'urlToGuide.guide.product.bannerLinks.icon',
    ],
  });

export const fetchUrlReplaceMap = fetchFromStrapi(
  'url-replace-map',
  makeStrapiUrlReplaceMapPopulate(),
  UrlReplaceMapCodec
);
