import Markdoc, { Schema } from '@markdoc/markdoc';

export type MenuItemProps<A> = {
  readonly isLeaf: boolean;
  readonly children: A;
};

export const menuItem: Schema = {
  render: 'Item',
  transform: (node, config) => {
    // track if the node has nested list or not
    const isLeaf = node.children.length === 1;
    const attrs = node.transformAttributes(config);
    return new Markdoc.Tag(
      'Item',
      { ...attrs, isLeaf },
      node.transformChildren(config)
    );
  },
};
