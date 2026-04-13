import { Paginated } from '@/lib/strapi/types/paginated';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

export function wrapAsRootEntity<T>(entity: T): RootEntity<T> {
  return { data: entity };
}

export function wrapAsPaginatedRootEntity<T>(
  entities: readonly T[]
): Paginated<T> {
  return {
    data: entities,
    meta: {
      pagination: {
        page: entities.length ? 1 : 0,
        pageSize: entities.length,
        pageCount: entities.length ? 1 : 0,
        total: entities.length,
      },
    },
  };
}
