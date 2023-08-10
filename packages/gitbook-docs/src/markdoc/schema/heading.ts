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
      .map((child) => (typeof child === 'string' ? child : ''))
      .filter((child) => !!child)
      .map(
        (child) =>
          child
            .trim()
            .toLowerCase()
            .normalize('NFD') // Split an accented letter in the base letter and the accent
            .replace(/[\u0300-\u036f]/g, '') // Remove all accents
            .replace(/ /g, '-') // Replace spaces with -
      )
      .join('-');

    return new Markdoc.Tag(`Heading`, { ...attributes, id }, children);
  },
};
