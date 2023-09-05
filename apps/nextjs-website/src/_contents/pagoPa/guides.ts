import { pagoPa } from './pagoPa';
import { GuideDefinition } from '../makeDocs';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

const saci: GuideDefinition = {
  product: pagoPa,
  guide: {
    name: 'SACI',
    slug: 'saci',
  },
  versions: [
    {
      version: '3.1.0',
      dirName: 'w0Q7L4P8ucTWqcitlbkJ',
    },
    {
      version: '3.0.1',
      dirName: 'NwSwJx0PH25LtVO7RbF5',
    },
    {
      version: '3.0.0',
      dirName: 'Dny2DKfeNer5ENutRdSp',
    },
    {
      version: '2.0.0',
      dirName: 'E6d6iTzjBzUfzNoZjadZ',
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};

const sanp: GuideDefinition = {
  product: pagoPa,
  guide: {
    name: 'SANP',
    slug: 'sanp',
  },
  versions: [
    {
      version: '3.4.1',
      dirName: '9E4vGfV6bOPGpOwZoKIm',
    },
    {
      version: '3.4.0',
      dirName: 'xStAOBVhMPuBPPjhED2d',
    },
    {
      version: '3.3.1',
      dirName: 'Z6DbUfot7pwmbrL7H8Og',
    },
    {
      version: '3.3.0',
      dirName: 'LO6Eu6yEgPpDLRlJbSAV',
    },
    {
      version: '3.2.2',
      dirName: 'GZIRCT9Rk6IDaXJpy4mj',
    },
    {
      version: '3.2.1',
      dirName: 'WDGhjr4kFEKAtGWeB26y',
    },
    {
      version: '3.2.0',
      dirName: 'v7eFccIIRcGfOIG6IHkT',
    },
    {
      version: '3.1.0',
      dirName: 'uZtPuOMNFRHnv2PsvM8Q',
    },
    {
      version: '3.0.0',
      dirName: 'z84MDJc9UBvpiRocRUv7',
    },
    {
      version: '2.5.1',
      dirName: 'P8TYVFYipQYir4JqodY3',
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};

const avvisi: GuideDefinition = {
  product: pagoPa,
  guide: {
    name: 'Avvisi di Pagamento',
    slug: 'avviso-pagamento',
  },
  versions: [
    {
      version: '3.1.0',
      dirName: 'E9RM3F60OM97FbTVrCW8',
    },
    // TODO: Uncomment once in sync
    // {
    //   version: '3.0.0',
    //   dirName: 'lph4boTulr49pD0pPBVM',
    // },
  ],
  bannerLinks: pagoPaBannerLinks,
};

const brand: GuideDefinition = {
  product: pagoPa,
  guide: {
    name: 'Linee Guida Brand pagoPA',
    slug: 'linee-guida-brand-pagopa',
  },

  versions: [
    {
      version: 'v1.0',
      dirName: '8phwN5u2QXllSKsqBjQU',
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};

const pda: GuideDefinition = {
  product: pagoPa,
  guide: {
    name: 'Portale delle Adesioni',
    slug: `portale-delle-adesioni`,
  },
  versions: [
    {
      version: 'v4',
      dirName: 'EQluaHvgNKaiHlsDcnrT',
    },
    {
      version: 'v3',
      dirName: '19risPm7aBUnTS0sVhyR',
    },
    {
      version: 'v2.2.5',
      dirName: '1phXXCgPXYbaIjTEs5C4',
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};

export const pagoPaGuides = [saci, sanp, avvisi, brand, pda];
