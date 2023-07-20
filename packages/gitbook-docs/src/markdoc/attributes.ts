import { Config } from '@markdoc/markdoc';

// eslint-disable-next-line functional/no-classes
export class BooleanAttr {
  readonly transform = (value: string) => value === 'true';
}

const convertLink = (link: string): string =>
  link.replace('/README.md', '').replace('README.md', '').replace('.md', '');

// eslint-disable-next-line functional/no-classes
export class LinkAttr {
  readonly transform = (value: string) =>
    !value.startsWith('http') ? convertLink(value) : value;
}

// eslint-disable-next-line functional/no-classes
export class PrefixLinkAttr {
  readonly transform = (value: string, config: Config) => {
    const prefix = config.variables?.linkPrefix;
    if (!value.startsWith('http')) {
      const href = typeof prefix === 'string' ? `${prefix}/${value}` : value;
      return convertLink(href);
    } else return value;
  };
}

const convertAssetsPath = (assetsPrefix: string, src: string) =>
  !src.startsWith('http') ? `${assetsPrefix}/${src}` : src;

// eslint-disable-next-line functional/no-classes
export class SrcAttr {
  readonly transform = (value: string, config: Config) => {
    const prefix = config.variables?.assetsPrefix;
    return typeof prefix === 'string'
      ? convertAssetsPath(prefix, value)
      : value;
  };
}
