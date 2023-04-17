import Markdoc, { ConfigType, Schema, Tag } from '@markdoc/markdoc';

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
export const summary: Schema = {
  render: 'string',
};

// https://docs.gitbook.com/content-creation/blocks/tabs
export const tabs: Schema = {};
export const tab: Schema = {};

// nodes override

const heading: Schema = {
  render: 'Heading',
  children: ['inline'],
  attributes: {
    level: { type: Number, required: true, default: 1 },
  },
};

const document: Schema = { ...Markdoc.nodes.document, render: 'Document' };

const paragraph: Schema = { ...Markdoc.nodes.paragraph, render: 'Paragraph' };

const link: Schema = { ...Markdoc.nodes.link, render: 'Link' };

// config
export const config: ConfigType = {
  tags: { hint, file, embed, details, summary, 'content-ref': pageLink },
  nodes: {
    document,
    heading,
    paragraph,
    link,
  },
};
