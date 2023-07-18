import Markdoc, { Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';

const img: Schema = {
  attributes: {
    src: { type: SrcAttr, required: true },
    alt: { type: String },
  },
};

export type FigureProps<A> = {
  readonly src: string;
  readonly alt?: string;
  readonly children: ReadonlyArray<A>;
};

export const figure: Schema = {
  attributes: {
    src: { type: SrcAttr, required: true },
    alt: { type: String },
  },
  transform: (node, config) => {
    const attrs = node.children
      .find(({ tag }) => tag === 'img')
      ?.transformAttributes({ ...config, tags: { img } });
    const children = node.children
      .find(({ tag }) => tag === 'figcaption')
      ?.transformChildren(config);
    return new Markdoc.Tag('Figure', attrs, children);
  },
};
