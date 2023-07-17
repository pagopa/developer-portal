import { Config } from '@markdoc/markdoc';

const convertLinkPath = (linkPrefix: string, href: string) =>
  !href.startsWith('http')
    ? `${linkPrefix}/${href}`
        .replace('/README.md', '')
        .replace('README.md', '')
        .replace('.md', '')
    : href;

// eslint-disable-next-line functional/no-classes
export class LinkAttr {
  readonly transform = (value: string, config: Config) => {
    const prefix = config.variables?.linkPrefix;
    return typeof prefix === 'string' ? convertLinkPath(prefix, value) : value;
  };
}
