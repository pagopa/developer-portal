import { pagoPa } from './pagoPa';
import { makeGuide } from '../makeDocs';

const saci = makeGuide({
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
});

const sanp = makeGuide({
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
});

const avvisi = makeGuide({
  product: pagoPa,
  guide: {
    name: 'Avvisi',
    slug: 'avvisi',
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
});

const brand = makeGuide({
  product: pagoPa,
  guide: {
    name: 'Brand',
    slug: 'brand',
  },

  versions: [
    {
      version: 'v1.0',
      dirName: '8phwN5u2QXllSKsqBjQU',
    },
  ],
});

const pda = makeGuide({
  product: pagoPa,
  guide: {
    name: 'PdA',
    slug: `pda`,
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
});

export const pagoPaGuides = [...saci, ...sanp, ...avvisi, ...brand, ...pda];
