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
        page: 1,
        pageSize: entities.length,
        pageCount: 1,
        total: entities.length,
      },
    },
  };
}
