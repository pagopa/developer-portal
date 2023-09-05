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
    // TODO: this cast will be removed when we can pass a custom type instead of Config
    const parseContentConfig = variables as ParseContentConfig;
    // Link to other spaces start with http://localhost:5000
    const linkToSpacesRegex = new RegExp(
      '^http:\\/\\/localhost:5000(\\/o\\/[\\w]*)?\\/s\\/(.*?)\\/?$',
      'g'
    );
    if (value && !value.startsWith('http')) {
      const isIndex = variables?.isPageIndex === true;
      const pagePath = isIndex
        ? variables.pagePath
        : path.parse(variables?.pagePath).dir;
      const href = path.join(pagePath, value);
      return convertLink(href);
    } else if (value?.match(linkToSpacesRegex)) {
      // Normalize URL to <spaceId>/<pagePath>
      const sanitizedSpacePagePath = value.replace(linkToSpacesRegex, '$2');
      const spacePrefix = parseContentConfig.spaceToPrefix.find((elem) =>
        sanitizedSpacePagePath.startsWith(elem.spaceId)
      );
      return spacePrefix
        ? sanitizedSpacePagePath.replace(
            spacePrefix.spaceId,
            spacePrefix.pathPrefix
          )
        : value;
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
