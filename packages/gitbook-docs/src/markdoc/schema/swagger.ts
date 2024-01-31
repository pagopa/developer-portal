import Markdoc, { Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';

export type SwaggerProps = {
  readonly baseUrl?: string;
  readonly method: string;
  readonly path: string;
  readonly src?: string;
  readonly summary?: string;
};

export const swagger: Schema = {
  attributes: {
    src: { type: SrcAttr },
    path: { type: String, required: true },
    method: { type: String, required: true },
    summary: { type: String },
    baseUrl: { type: String },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    return new Markdoc.Tag('Swagger', attrs, []);
  },
};
