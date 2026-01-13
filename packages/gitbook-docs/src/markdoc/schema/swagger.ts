import Markdoc, { RenderableTreeNode, Schema } from '@markdoc/markdoc';
import { SrcAttr } from '../attributes';

export type SwaggerProps<A> = {
  readonly baseUrl?: string;
  readonly method: string;
  readonly path: string;
  readonly src?: string;
  readonly summary?: string;
  readonly children: A;
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
    const attrs: Record<string, unknown> = node.transformAttributes(config);
    const children: readonly RenderableTreeNode[] =
      node.transformChildren(config);
    return new Markdoc.Tag('Swagger', attrs, [...children]);
  },
};

export type SwaggerDescriptionProps<A> = {
  readonly children: A;
};

export const swaggerDescription: Schema = {
  transform: (node, config) => {
    const children = node.transformChildren(config);
    return new Markdoc.Tag('SwaggerDescription', {}, children);
  },
};

export type SwaggerParameterProps<A> = {
  readonly in: string;
  readonly name: string;
  readonly required: boolean;
  readonly children: A;
};

export const swaggerParameter: Schema = {
  attributes: {
    in: { type: String, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, required: true },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Markdoc.Tag('SwaggerParameter', attrs, children);
  },
};

export type SwaggerResponseProps<A> = {
  readonly status: string;
  readonly description: string;
  readonly children: A;
};

export const swaggerResponse: Schema = {
  attributes: {
    status: { type: String, required: true },
    description: { type: String, required: true },
  },
  transform: (node, config) => {
    const attrs = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Markdoc.Tag('SwaggerResponse', attrs, children);
  },
};
