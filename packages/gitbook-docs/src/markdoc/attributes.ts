import { Config } from '@markdoc/markdoc';
import path from 'path';
import { ParseContentConfig } from '../parseContent';

const getCorrectGuide = (guide: string) => {
  switch (guide) {
    case 'manuale-operativo-dei-servizi':
      return 'manuale-servizi';
    case 'kb-enti':
    case 'kb-enti-adesione':
    case 'kb-enti-servizi':
    case 'kb-enti-messaggi':
    case 'kb-enti-pagamenti':
    case 'kb-enti-accordi':
    case 'kb-enti-assistenza':
      return 'supporto-agli-enti';
    case 'kit-di-comunicazione-per-gli-enti':
      return 'kit-comunicazione';
    case 'io-come-aderire':
      return 'accordi-adesione';
    case 'f.a.q.-per-integratori':
      return 'knowledge-base';
    case 'modello-di-integrazione-di-piattaforma-notifiche':
      return 'modello-di-integrazione';
    case 'manuale-operativo-back-office-pagopa-ente-creditore':
      return 'manuale-bo-ec';
    case 'manuale-bo-pagopa-psp':
      return 'manuale-bo-psp';
    case 'gestionedeglierrori':
      return 'errori';
    case 'dizionario-dei-metadata':
      return 'metadata';
    case 'manuale-operativo-di-firma-con-io':
      return 'manuale-operativo';
    default:
      return guide;
  }
};

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
    .replace(new RegExp('^(.*?)\\/?$'), '$1');

// eslint-disable-next-line functional/no-classes
export class LinkAttr {
  readonly transform = (value: string | null, { variables }: Config) => {
    // TODO: this cast will be removed when we can pass a custom type instead of Config
    const parseContentConfig = variables as ParseContentConfig;
    // Link to other spaces when start with http://localhost:5000 or http://127.0.0.1:5000
    const linkToSpacesRegex = new RegExp(
      '^http:\\/\\/(?:localhost|127.0.0.1):5000(\\/o\\/[\\w]*)?\\/s\\/(.*?)\\/?$',
      'g'
    );
    const DOCS_URL = 'https://docs.pagopa.it';

    if (value && !value.startsWith('http') && !value.startsWith('mailto:')) {
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
    } else if (value?.includes(DOCS_URL)) {
      const cleanUrl = value.replace(DOCS_URL, '');

      const [currentGuide] = cleanUrl.split('/').filter((p) => p !== '');
      const correctGuide = getCorrectGuide(currentGuide);
      const anchor = cleanUrl.split('#')[1];

      const finalUrl = cleanUrl.replace(currentGuide, correctGuide);

      const guides = parseContentConfig.gitBookPagesWithTitle;

      const guide = guides.find((g) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_product, _path, name, _version, ...rest] = g.path
          .split('/')
          .filter((p) => p !== '');
        return finalUrl === `/${name}/${rest.join('/')}`;
      });

      if (guide) {
        return `${guide.path}${anchor && anchor !== '' ? `#${anchor}` : ''}`;
      }

      return value;
    } else {
      return value;
    }
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
