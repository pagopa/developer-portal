import Markdoc, { Schema } from '@markdoc/markdoc';
import { sanitizedText } from './sanitizedText';

export type HeadingProps<A> = {
  readonly level: number;
  readonly children: A;
  readonly id: string;
};

export const heading: Schema = {
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true },
  },
  transform(node, config) {
    const nodes = { text: sanitizedText };
    const children = node.transformChildren({
      ...config,
      nodes,
    });
    const attributes = node.transformAttributes(config);

    const id: string = children
      .filter((child) => typeof child === 'string')
      .map((child) =>
        (child as string)
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/ /g, '-')
      )
      .join('-');

    return new Markdoc.Tag(`Heading`, { ...attributes, id }, children);
  },
};
