import { Config as MarkdocConfig } from '@markdoc/markdoc';
import { ParseContentConfig } from '../parseContent';
import path from 'path';

type Config = MarkdocConfig & {
  readonly variables: ParseContentConfig;
};

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
      const isIndex = variables.isPageIndex;
      const pagePath = isIndex
        ? variables.pagePath
        : path.parse(variables.pagePath).dir;
      const href = path.join(pagePath, value);
      return convertLink(href);
    } else return value;
  };
}

// eslint-disable-next-line functional/no-classes
export class PrefixLinkAttr {
  readonly transform = (value: string, config: Config) => {
    if (!value.startsWith('http')) {
      const href = path.join(config.variables.linkPrefix, value);
      return convertLink(href);
    } else return value;
  };
}

const convertAssetsPath = (assetsPrefix: string, src: string) =>
  !src.startsWith('http') ? `${assetsPrefix}/${src}` : src;

// eslint-disable-next-line functional/no-classes
export class SrcAttr {
  readonly transform = (value: string, config: Config) =>
    path.join(config.variables.assetsPrefix, value);
}
