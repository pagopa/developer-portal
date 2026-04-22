import qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';

export const fetchCollectionFromStrapi = <T>(
  contentType: string,
  productSlug: string,
  queryParams: Record<string, unknown>
) =>
  fetchFromStrapi<T>(
    contentType,
    qs.stringify({
      filters: {
        product: {
          slug: {
            $eq: productSlug,
          },
        },
      },
      pagination: {
        limit: -1,
      },
      ...queryParams,
    })
  );
