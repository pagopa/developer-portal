import { Schema } from '@markdoc/markdoc';

type ChildrenAttr<A> = {
  readonly children: A;
};

export type TableProps<A> = ChildrenAttr<A>;
export type TableHeadProps<A> = ChildrenAttr<A>;
export type TableBodyProps<A> = ChildrenAttr<A>;
export type TableRProps<A> = ChildrenAttr<A>;
export type TableHProps<A> = ChildrenAttr<A>;
export type TableDProps<A> = ChildrenAttr<A>;

export const table: Schema = {
  render: 'Table',
};

export const thead: Schema = {
  render: 'TableHead',
};

export const tbody: Schema = {
  render: 'TableBody',
};

export const tr: Schema = {
  render: 'TableR',
};

export const th: Schema = {
  render: 'TableH',
};

export const td: Schema = {
  render: 'TableD',
};
