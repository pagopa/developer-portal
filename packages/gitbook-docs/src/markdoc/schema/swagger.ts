import Markdoc, { Schema } from '@markdoc/markdoc';

export type SwaggerProps = {
  readonly src: string;
  readonly path: string;
  readonly method: string;
};

export const swagger: Schema = {
  attributes: {
    src: { type: String, required: true },
    path: { type: String, required: true },
    method: { type: String, required: true },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    return new Markdoc.Tag('Swagger', attrs, []);
  },
};
