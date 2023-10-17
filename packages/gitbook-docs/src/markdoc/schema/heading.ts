import Markdoc, { Node, Schema } from '@markdoc/markdoc';
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
  transform(node: Node, config) {
    const children = node.transformChildren({
      ...config,
      nodes: { ...config.nodes, text: sanitizedText },
    });
    const attributes = node.transformAttributes(config);

    const id: string = Array.from(node.walk())
      .filter((node: Node) => node.type === 'text' || node.type === 'code')
      .filter((node: Node) => !!node.attributes.content.trim())
      .map(
        (node: Node) =>
          node.attributes.content
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
            .replace(/^\s*/, '')
            .normalize('NFD') // Split an accented letter in the base letter and the accent
            .replace(/[\u0300-\u036f]/g, '') // Remove all accents
            .replace(/ /g, '-') // Replace spaces with -
      )
      .join('-');

    return new Markdoc.Tag(`Heading`, { ...attributes, id }, children);
  },
};
