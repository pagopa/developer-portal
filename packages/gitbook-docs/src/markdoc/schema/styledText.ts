import Markdoc, { Schema } from '@markdoc/markdoc';

export type StyledTextProps = {
  readonly style: 'strong' | 'italic' | 'code' | 'strikethrough';
  readonly children: string;
};

const tagName = 'StyledText';

export const strong: Schema = {
  transform: (node, config) => {
    const children = node.transformChildren(config);
    return new Markdoc.Tag(tagName, { style: 'strong' }, children);
  },
};

export const em: Schema = {
  transform: (node, config) => {
    const children = node.transformChildren(config);
    return new Markdoc.Tag(tagName, { style: 'italic' }, children);
  },
};

export const strikethrough: Schema = {
  transform: (node, config) => {
    const children = node.transformChildren(config);
    return new Markdoc.Tag(tagName, { style: 'strikethrough' }, children);
  },
};

export const code: Schema = {
  transform: (node) => {
    const children = [node.attributes.content.replace('``', '')];
    return new Markdoc.Tag(tagName, { style: 'code' }, children);
  },
};
