import { PageRef } from '@/domain/PageRef';

export type ProductSubHeader = {
  title: string;
  submenu: ReadonlyArray<PageRef>;
};
