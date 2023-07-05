import Markdoc, { ConfigType, Schema, Tag } from '@markdoc/markdoc';

// https://docs.gitbook.com/content-creation/blocks/expandable
export const details: Schema = {
  render: 'Expandable',
  transform: (node, config) => {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    // TODO This is dangerous, use a better way
    const [head, ...rest] = children;
    return new Tag(`Expandable`, { ...attributes, title: head }, rest);
  },
};

// https://docs.gitbook.com/content-creation/blocks/embed-a-url#medium-article
export const embed: Schema = {
  render: 'Embed',
  attributes: {
    url: {
      type: String,
      required: true,
    },
  },
};

// https://docs.gitbook.com/content-creation/blocks/insert-files
export const file: Schema = {
  render: 'File',
  attributes: {
    src: {
      type: String,
      required: true,
    },
  },
};

// https://docs.gitbook.com/content-creation/blocks/hint
export const hint: Schema = {
  render: 'Hint',
  attributes: {
    style: {
      type: String,
      // TODO: take somehow from HintProps
      matches: ['info', 'success', 'warning', 'danger', 'info'],
    },
  },
};

// https://docs.gitbook.com/content-creation/blocks/page-link
export const pageLink: Schema = {
  render: 'PageLink',
  children: ['Link'],
  attributes: {
    url: {
      type: String,
      required: true,
    },
  },
  transform: (node, config) =>
    Array.from(node.walk())
      .filter((current) => current.type === 'link')
      .map(
        (link) =>
          new Tag(
            'PageLink',
            node.transformAttributes(config),
            link.transformChildren(config)
          )
      ),
};

export const summary: Schema = {
  render: 'string',
};

// nodes override

const document: Schema = { ...Markdoc.nodes.document, render: 'Document' };

const heading: Schema = {
  render: 'Heading',
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true, default: 1 },
  },
};

const hr: Schema = { ...Markdoc.nodes.hr, render: 'Hr' };

const item: Schema = { ...Markdoc.nodes.item, render: 'Item' };

const link: Schema = { ...Markdoc.nodes.link, render: 'Link' };

const list: Schema = {
  children: ['item'],
  attributes: {
    ordered: { type: Boolean, render: false, required: true },
    start: { type: Number },
    marker: { type: String, render: false },
  },
  transform(node, config) {
    return new Tag(
      node.attributes.ordered ? 'ol' : 'List',
      node.transformAttributes(config),
      node.transformChildren(config)
    );
  },
};

const paragraph: Schema = { ...Markdoc.nodes.paragraph, render: 'Paragraph' };

const strong: Schema = { ...Markdoc.nodes.strong, render: 'Strong' };

const text: Schema = {
  attributes: {
    content: { type: String, required: true },
  },
  transform(node) {
    return node.attributes.content;
  },
};

// config
export const config: ConfigType = {
  tags: { hint, file, embed, details, summary, 'content-ref': pageLink },
  nodes: {
    document,
    heading,
    hr,
    item,
    link,
    list,
    paragraph,
    strong,
    text,
  },
};
