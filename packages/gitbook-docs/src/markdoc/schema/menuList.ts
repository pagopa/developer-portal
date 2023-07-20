import { Schema } from '@markdoc/markdoc';

export type MenuListProps<A> = {
  readonly children: A;
};

export const menuList: Schema = {
  render: 'List',
};
