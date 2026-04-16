import Markdoc, { Schema } from '@markdoc/markdoc';

export type ColumnsProps<A> = {
  readonly children: ReadonlyArray<A>;
};

export type ColumnProps<A> = {
  readonly children: ReadonlyArray<A>;
  readonly width?: string;
};

/**
 * Schema for the item tag: {% columns %}
 */
export const columns: Schema = {
  render: 'Columns',
  children: ['column'],
  transform: (node, config) => {
    const tags = { ...config.tags, column };
    const children = node.transformChildren({ ...config, tags });
    return new Markdoc.Tag('Columns', {}, children);
  },
};

/**
 * Schema for the item tag: {% column width="1/2" %}
 */
export const column: Schema = {
  render: 'Column',
  attributes: {
    width: { type: String },
  },
  children: ['paragraph'],
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Markdoc.Tag('Column', attrs, children);
  },
};
