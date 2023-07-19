import Markdoc, { Schema } from '@markdoc/markdoc';

export type TitleProps<A> = {
  readonly children: A;
};

export const title: Schema = {
  transform: (node, config) => {
    // skip headers of level 1
    if (node.attributes['level'] !== 1)
      return new Markdoc.Tag(
        'Title',
        node.transformAttributes(config),
        node.transformChildren(config)
      );
    else return [];
  },
};
