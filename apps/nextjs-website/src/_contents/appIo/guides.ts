import { appIo } from './appIo';
import { GuideDefinition } from '../makeDocs';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';

const guidaTecnica: GuideDefinition = {
  product: appIo,
  guide: {
    name: 'Guida tecnica',
    slug: `io-guida-tecnica`,
  },
  versions: [
    { version: 'v3.0', dirName: 'KaAXw9uMBC5zBbJ5o8a6' },
    { version: 'v2.4', dirName: 'r65fve0XPThNw1ljBi57' },
    { version: 'v2.3', dirName: 'mzwjFv2XaE1mjbz7I8gt' },
    { version: 'v2.2', dirName: 'coSKRte21UjDBRWKLtEs' },
    { version: 'v1.3', dirName: 'OoU8rMn4ZUWvfkSueJIl' },
    { version: 'v1.2', dirName: 'DOaGsRYKzkZYmIAbjNII' },
  ],
  bannerLinks: appIoBannerLinks,
};

const manualeDeiServizi: GuideDefinition = {
  product: appIo,
  guide: {
    name: "Manuale dei servizi dell'app IO",
    slug: 'manuale-servizi',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'zcLztiq5qDSVw9rRjW7p',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

const supportoAgliEnti: GuideDefinition = {
  product: appIo,
  guide: {
    name: 'Supporto agli enti',
    slug: 'supporto-agli-enti',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'rPr79NYJ4xbKA7EvgHxo',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

const kitDiComunicazione: GuideDefinition = {
  product: appIo,
  guide: {
    name: 'Kit di comunicazione',
    slug: 'kit-comunicazione',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'SpNLdqKSqoCvaOneGN7K',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

const cartaGiovani: GuideDefinition = {
  product: appIo,
  guide: {
    name: 'Carta Giovani - Documentazione Tecnica Portale Operatori',
    slug: 'carta-giovani-nazionale',
  },
  versions: [
    // TODO: Uncomment once in sync
    // {
    //   version: '1.1.0',
    //   dirName: 'Vgh5yq561A3SOPVQrWes',
    // },
  ],
  bannerLinks: appIoBannerLinks,
};

export const appIoGuides = [
  guidaTecnica,
  manualeDeiServizi,
  supportoAgliEnti,
  kitDiComunicazione,
  cartaGiovani,
];
