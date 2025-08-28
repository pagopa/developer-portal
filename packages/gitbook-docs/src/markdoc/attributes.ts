import { Config } from '@markdoc/markdoc';
import path from 'path';
import { ParseContentConfig } from '../parseContent';

// eslint-disable-next-line functional/no-classes
export class BooleanAttr {
  readonly transform = (value: string) => value === '' || value === 'true';
}

// eslint-disable-next-line functional/no-classes
export class BooleanOrNullAttr {
  readonly transform = (value: string) => {
    if (value === 'true') return true;
    else if (value === 'false') return false;
    else return null;
  };
}

const convertLink = (link: string): string =>
  link
    .replace('/README.md', '')
    .replace('README.md', '')
    .replace('.md', '')
    .replace(new RegExp('^(.*?)\\/?$'), '$1')
    // uniform links like 'this/is/a/path/#fragment' to 'this/is/a/path#fragment'
    .replace(new RegExp('/#'), '#');

// eslint-disable-next-line functional/no-classes
export class LinkAttr {
  readonly transform = (value: string | null, { variables }: Config) => {
    // TODO: this cast will be removed when we can pass a custom type instead of Config
    const parseContentConfig = variables as ParseContentConfig;
    // Link to other spaces when start with http://localhost:5000, http://127.0.0.1:5000 or https://app.gitbook.com

    const { urlReplaces } = parseContentConfig;
    // Find the first key that match the url
    const rewriteKey = Object.keys(urlReplaces).find((key) =>
      value?.startsWith(key)
    );
    if (value && rewriteKey) {
      const href = value.replace(rewriteKey, urlReplaces[rewriteKey]);
      return convertLink(href);
    } else {
      return value;
    }
  };
}

// eslint-disable-next-line functional/no-classes
export class PrefixLinkAttr {
  readonly transform = (value: string | null, { variables }: Config) => {
    if (value && !value.startsWith('http') && !value.startsWith('/')) {
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
    value && !value.startsWith('http') && !value.startsWith('/')
      ? `${variables?.assetsPrefix}${path.join('/', value)}`
      : value;
}
