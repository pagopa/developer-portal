import Markdoc, { Node, Schema } from '@markdoc/markdoc';
import { sanitizedText, sanitizedTextLeadingWhitespace } from './sanitizedText';

export type HeadingProps<A> = {
  readonly level: number;
  readonly children: A;
  readonly id: string;
};

export const heading = (excludeEmoji?: boolean): Schema => ({
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true },
  },
  transform(node: Node, config) {
    const children = node.transformChildren({
      ...config,
      nodes: {
        ...config.nodes,
        text: excludeEmoji ? sanitizedTextLeadingWhitespace : sanitizedText,
      },
    });
    const attributes = node.transformAttributes(config);

    const id: string = Array.from(node.walk())
      .filter((node: Node) => node.type === 'text' || node.type === 'code')
      .filter((node: Node) => !!node.attributes.content.trim())
      .map(
        (node: Node) =>
          node.attributes.content
            .normalize('NFD') // Split an accented letter in the base letter and the accent
            .replace(/[\u0300-\u036f]/g, '') // Remove all accents
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with -
            .replace(/-+/g, '-') // Replace multiple - with single -
            .replace(/^-+|-+$/g, '') // Remove leading and trailing -
      )
      .join('-')
      .replace(/-+/g, '-') // Replace multiple - with single - (in case join created them)
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing - (in case join created them)

    return new Markdoc.Tag(`Heading`, { ...attributes, id }, children);
  },
});
