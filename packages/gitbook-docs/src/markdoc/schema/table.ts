import Markdoc, { Schema } from '@markdoc/markdoc';
import { BooleanAttr } from '../attributes';

type ChildrenAttr<A> = {
  readonly children: A;
};

export type TableProps<A> = ChildrenAttr<A> & {
  readonly 'data-card-size'?: 'large';
  readonly 'data-view'?: 'cards';
  readonly 'data-header-hidden': boolean;
};
export type TableHeadProps<A> = ChildrenAttr<A>;
export type TableBodyProps<A> = ChildrenAttr<A>;
export type TableRProps<A> = ChildrenAttr<A>;
export type TableHProps<A> = ChildrenAttr<A> & {
  readonly 'data-hidden': boolean;
  readonly 'data-card-target'?: boolean;
  readonly 'data-type'?: string;
};
export type TableDProps<A> = ChildrenAttr<A>;

export const table: Schema = {
  attributes: {
    'data-card-size': { type: String, matches: ['large'] },
    'data-view': { type: String, matches: ['cards'] },
    'data-header-hidden': { type: BooleanAttr },
  },
  transform: (node, config) => {
    const nodes = {
      ...config.nodes,
      thead,
      tbody,
      tr,
      th,
      td,
    };
    const tags = {
      ...config.tags,
      htmltable: table,
      htmlthead: thead,
      htmltbody: tbody,
      htmltr: tr,
      htmlth: th,
      htmltd: td,
    };
    const attrs = node.transformAttributes({ ...config, nodes, tags });
    const children = node.transformChildren({ ...config, nodes, tags });
    return new Markdoc.Tag('Table', attrs, children);
  },
};

const thead: Schema = {
  render: 'TableHead',
};

const tbody: Schema = {
  render: 'TableBody',
};

const tr: Schema = {
  render: 'TableR',
};

const th: Schema = {
  render: 'TableH',
  attributes: {
    'data-hidden': { type: BooleanAttr },
    'data-card-target': { type: BooleanAttr },
    'data-type': { type: String },
  },
};

export const td: Schema = {
  render: 'TableD',
};
