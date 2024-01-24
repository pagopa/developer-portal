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
    {
      version: 'v5.0',
      dirName: 'UAvruCMPsowDKZMH1jNr',
    },
    {
      version: 'v4.0',
      dirName: 'mzXDeCSRezM6r2ocy8gb',
    },
    {
      version: 'v3.0',
      dirName: 'KaAXw9uMBC5zBbJ5o8a6',
    },
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
      version: 'v2.0',
      dirName: 'xWONfJmawghGo2ekuaKh',
    },
    {
      version: 'v1.1',
      dirName: 'VjpCR0JtTGTN9pAUoAg3',
    },
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
    {
      version: 'v1.0',
      dirName: 'Vgh5yq561A3SOPVQrWes',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

const accordiAdesione: GuideDefinition = {
  product: appIo,
  guide: {
    name: 'Adesione ad IO',
    slug: 'accordi-adesione',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'O7clRJB6pY0VI5sEBF8J',
    },
  ],
  bannerLinks: appIoBannerLinks,
};

export const appIoGuides = [
  guidaTecnica,
  manualeDeiServizi,
  supportoAgliEnti,
  kitDiComunicazione,
  cartaGiovani,
  accordiAdesione,
];
