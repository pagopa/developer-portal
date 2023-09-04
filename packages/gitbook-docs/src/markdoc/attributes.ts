import { Config } from '@markdoc/markdoc';
import path from 'path';
import { ParseContentConfig } from '../parseContent';

// eslint-disable-next-line functional/no-classes
export class BooleanAttr {
  readonly transform = (value: string) => value === '' || value === 'true';
}

const convertLink = (link: string): string =>
  link.replace('/README.md', '').replace('README.md', '').replace('.md', '');

// eslint-disable-next-line functional/no-classes
export class LinkAttr {
  readonly transform = (value: string | null, { variables }: Config) => {
    if (value && !value.startsWith('http')) {
      const isIndex = variables?.isPageIndex === true;
      const pagePath = isIndex
        ? variables.pagePath
        : path.parse(variables?.pagePath).dir;
      const href = path.join(pagePath, value);
      return convertLink(href);
    } else if (value?.startsWith('http://localhost:5000')) {
      // Link to other spaces starts with http://localhost:5000
      // http://localhost:5000/o/KxY/s/s1/
      // http://localhost:5000/s/s0/1

      const regex = new RegExp(
        '^http:\\/\\/localhost:5000(\\/o\\/[\\w]*)?\\/s\\/',
        'g'
      );
      const [spaceId, ...rest] = value
        .replace(regex, '')
        .split('/')
        .filter(Boolean);

      const spaceToPrefix: ParseContentConfig['spaceToPrefix'] =
        variables?.spaceToPrefix;
      const spacePrefix = spaceToPrefix.find(
        (elem) => spaceId === elem.spaceId
      );

      if (spacePrefix) {
        if (rest.length === 0) {
          return spacePrefix.pathPrefix;
        } else {
          return `${spacePrefix.pathPrefix}/${rest.join('/')}`;
        }
      } else {
        return value;
      }
    } else return value;
  };
}

// eslint-disable-next-line functional/no-classes
export class PrefixLinkAttr {
  readonly transform = (value: string | null, { variables }: Config) => {
    if (value && !value.startsWith('http')) {
      const href = path.join(variables?.linkPrefix, value);
      return convertLink(href);
    } else return value;
  };
}

// eslint-disable-next-line functional/no-classes
export class SrcAttr {
  readonly transform = (value: string | null, { variables }: Config) =>
    // Ignore any '../' (a.k.a parent directory of current directory)
    // The path.join('/', value) do the trick. It removes any '../' before join
    // it with assetsPrefix. E.g.: ../../../a/b => /a/b
    value && !value.startsWith('http')
      ? path.join(variables?.assetsPrefix, path.join('/', value))
      : value;
}
