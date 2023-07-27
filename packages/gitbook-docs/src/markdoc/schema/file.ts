import Markdoc, { Schema } from '@markdoc/markdoc';
import path from 'path';
import { SrcAttr } from '../attributes';
import { hasMissingClosingError } from '../errors';

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
    // handle a file without closing tag as self-closing tag
    if (!hasMissingClosingError(node.errors, 'missing-closing')) {
      // find text node to use as caption
      const textCnt = Array.from(node.walk()).find((n) => n.type === 'text')
        ?.attributes['content'];
      return new Markdoc.Tag('File', { ...attrs, caption: textCnt });
    } else {
      // consider unclosing file tag as self-closing tag without children
      // render the children as sibling
      const result = new Markdoc.Tag('File', { ...attrs, filename });
      return [result, ...node.transformChildren(config)];
    }
  },
};
