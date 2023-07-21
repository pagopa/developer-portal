import { Config } from '@markdoc/markdoc';
import path from 'path';

// eslint-disable-next-line functional/no-classes
export class BooleanAttr {
  readonly transform = (value: string) => value === 'true';
}

const convertLink = (link: string): string =>
  link.replace('/README.md', '').replace('README.md', '').replace('.md', '');

// eslint-disable-next-line functional/no-classes
export class LinkAttr {
  readonly transform = (value: string, { variables }: Config) => {
    if (!value.startsWith('http')) {
      const isIndex = variables?.isPageIndex === true;
      const pagePath = isIndex
        ? variables.pagePath
        : path.parse(variables?.pagePath).dir;
      const href = path.join(pagePath, value);
      return convertLink(href);
    } else return value;
  };
}

// eslint-disable-next-line functional/no-classes
export class PrefixLinkAttr {
  readonly transform = (value: string, { variables }: Config) => {
    if (!value.startsWith('http')) {
      const href = path.join(variables?.linkPrefix, value);
      return convertLink(href);
    } else return value;
  };
}

// eslint-disable-next-line functional/no-classes
export class SrcAttr {
  readonly transform = (value: string, { variables }: Config) =>
    !value.startsWith('http')
      ? path.join(variables?.assetsPrefix, value)
      : value;
}
