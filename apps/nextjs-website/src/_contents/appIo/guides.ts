import { appIO } from './appIO';
import { makeGuide } from '../makeDocs';

const guidaTecnica = makeGuide({
  product: appIO,
  guide: {
    name: 'Guida tecnica',
    slug: `guida-tecnica`,
  },
  versions: [
    {
      version: 'v2.4',
      dirName: 'r65fve0XPThNw1ljBi57',
    },
    {
      version: 'v2.3',
      dirName: 'mzwjFv2XaE1mjbz7I8gt',
    },
    {
      version: 'v2.2',
      dirName: 'coSKRte21UjDBRWKLtEs',
    },
    {
      version: 'v1.3',
      dirName: 'OoU8rMn4ZUWvfkSueJIl',
    },
    {
      version: 'v1.2',
      dirName: 'DOaGsRYKzkZYmIAbjNII',
    },
  ],
});

const manualeDeiServizi = makeGuide({
  product: appIO,
  guide: {
    name: "Manuale dei servizi dell'app IO",
    slug: 'manuale-dei-servizi',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'zcLztiq5qDSVw9rRjW7p',
    },
  ],
});

const supportoAgliEnti = makeGuide({
  product: appIO,
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
});

const kitDiComunicazione = makeGuide({
  product: appIO,
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
});

export const appIoGuides = [
  ...guidaTecnica,
  ...manualeDeiServizi,
  ...supportoAgliEnti,
  ...kitDiComunicazione,
];
