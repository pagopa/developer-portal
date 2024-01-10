import Markdoc, { Schema } from '@markdoc/markdoc';
import path from 'path';
import { SrcAttr } from '../attributes';

export type FileProps = {
  readonly src: string;
  readonly filename: string;
  readonly caption?: string;
};

export const file: Schema = {
  attributes: {
    src: {
      type: SrcAttr,
      required: true,
    },
  },
  transform: (node, config) => {
    const src = node.attributes['src'];
    const filename = typeof src === 'string' ? path.parse(src).name : 'Unknown';
    const attrs = { ...node.transformAttributes(config), filename };

    // find text node to use as caption
    const textCnt = Array.from(node.walk()).find((n) => n.type === 'text')
      ?.attributes['content'];
    return new Markdoc.Tag('File', { ...attrs, caption: textCnt });
  },
};
