import Markdoc, { Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';

export type ImageProps = {
  readonly src: string;
  readonly alt?: string;
  readonly caption?: string;
};

export const img: Schema = {
  render: 'Image',
  attributes: {
    src: { type: SrcAttr, required: true },
    alt: { type: String },
  },
};

export const figure: Schema = {
  attributes: {
    src: { type: SrcAttr, required: true },
    alt: { type: String },
  },
  transform: (node, config) => {
    const caption = node.children
      .find(({ tag }) => tag === 'figcaption')
      ?.transformChildren(config)
      .find((text) => typeof text === 'string');
    const imgAttrs = node.children
      .find(({ tag }) => tag === 'img')
      ?.transformAttributes(config);
    const attrs =
      typeof caption === 'string' ? { ...imgAttrs, caption } : imgAttrs;
    return new Markdoc.Tag('Image', attrs);
  },
};
