import { StrapiUrlReplaceMap } from '@/lib/strapi/types/urlReplaceMap';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import qs from 'qs';

const makeStrapiUrlReplaceMapPopulate = () =>
  qs.stringify({
    populate: {
      urlToGuide: {
        populate: {
          guide: {
            populate: ['product']
          }
        }
      }
    }
  });

export const fetchUrlReplaceMap = fetchFromStrapi<StrapiUrlReplaceMap>(
  'url-replace-map',
  makeStrapiUrlReplaceMapPopulate()
);
