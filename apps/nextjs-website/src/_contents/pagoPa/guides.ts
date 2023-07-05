import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { pagoPa } from './pagoPa';
import { parseDoc } from 'gitbook-docs/parseDoc';

const saci = {
  name: 'SACI',
  path: `${pagoPa.path}/guides/saci`,
};

const sanp = {
  name: 'SANP',
  path: `${pagoPa.path}/guides/saci`,
};

const avvisi = {
  name: 'Avvisi',
  path: `${pagoPa.path}/guides/avvisi`,
};

const brand = {
  name: 'Brand',
  path: `${pagoPa.path}/guides/brand`,
};

const pda = {
  name: 'PdA',
  path: `${pagoPa.path}/guides/pda`,
};

const docs = [
  {
    product: pagoPa,
    guide: saci,
    version: {
      name: '3.1.0',
      path: `${saci.path}/3.1.0`,
    },
    source: {
      pathPrefix: `${saci.path}/3.1.0`,
      assetsPrefix: `${docsAssetsPath}/w0Q7L4P8ucTWqcitlbkJ`,
      dirPath: `${docsPath}/w0Q7L4P8ucTWqcitlbkJ`,
    },
  },
  {
    product: pagoPa,
    guide: saci,
    version: {
      name: '3.0.1',
      path: `${saci.path}/3.0.1`,
    },
    source: {
      pathPrefix: `${saci.path}/3.0.1`,
      assetsPrefix: `${docsAssetsPath}/NwSwJx0PH25LtVO7RbF5`,
      dirPath: `${docsPath}/NwSwJx0PH25LtVO7RbF5`,
    },
  },
  {
    product: pagoPa,
    guide: saci,
    version: {
      name: '3.0.0',
      path: `${saci.path}/3.0.0`,
    },
    source: {
      pathPrefix: `${saci.path}/3.0.0`,
      assetsPrefix: `${docsAssetsPath}/Dny2DKfeNer5ENutRdSp`,
      dirPath: `${docsPath}/Dny2DKfeNer5ENutRdSp`,
    },
  },
  {
    product: pagoPa,
    guide: saci,
    version: {
      name: '2.0.0',
      path: `${saci.path}/2.0.0`,
    },
    source: {
      pathPrefix: `${saci.path}/2.0.0`,
      assetsPrefix: `${docsAssetsPath}/E6d6iTzjBzUfzNoZjadZ`,
      dirPath: `${docsPath}/E6d6iTzjBzUfzNoZjadZ`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.4.1',
      path: `${sanp.path}/3.4.1`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.4.1`,
      assetsPrefix: `${docsAssetsPath}/9E4vGfV6bOPGpOwZoKIm`,
      dirPath: `${docsPath}/9E4vGfV6bOPGpOwZoKIm`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.4.0',
      path: `${sanp.path}/3.4.0`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.4.0`,
      assetsPrefix: `${docsAssetsPath}/xStAOBVhMPuBPPjhED2d`,
      dirPath: `${docsPath}/xStAOBVhMPuBPPjhED2d`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.3.1',
      path: `${sanp.path}/3.3.1`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.3.1`,
      assetsPrefix: `${docsAssetsPath}/Z6DbUfot7pwmbrL7H8Og`,
      dirPath: `${docsPath}/Z6DbUfot7pwmbrL7H8Og`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.3.0',
      path: `${sanp.path}/3.3.0`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.3.0`,
      assetsPrefix: `${docsAssetsPath}/LO6Eu6yEgPpDLRlJbSAV`,
      dirPath: `${docsPath}/LO6Eu6yEgPpDLRlJbSAV`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.2.2',
      path: `${sanp.path}/3.2.2`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.2.2`,
      assetsPrefix: `${docsAssetsPath}/GZIRCT9Rk6IDaXJpy4mj`,
      dirPath: `${docsPath}/GZIRCT9Rk6IDaXJpy4mj`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.2.1',
      path: `${sanp.path}/3.2.1`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.2.1`,
      assetsPrefix: `${docsAssetsPath}/WDGhjr4kFEKAtGWeB26y`,
      dirPath: `${docsPath}/WDGhjr4kFEKAtGWeB26y`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.2.0',
      path: `${sanp.path}/3.2.0`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.2.0`,
      assetsPrefix: `${docsAssetsPath}/v7eFccIIRcGfOIG6IHkT`,
      dirPath: `${docsPath}/v7eFccIIRcGfOIG6IHkT`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.1.0',
      path: `${sanp.path}/3.1.0`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.1.0`,
      assetsPrefix: `${docsAssetsPath}/uZtPuOMNFRHnv2PsvM8Q`,
      dirPath: `${docsPath}/uZtPuOMNFRHnv2PsvM8Q`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '3.0.0',
      path: `${sanp.path}/3.0.0`,
    },
    source: {
      pathPrefix: `${sanp.path}/3.0.0`,
      assetsPrefix: `${docsAssetsPath}/z84MDJc9UBvpiRocRUv7`,
      dirPath: `${docsPath}/z84MDJc9UBvpiRocRUv7`,
    },
  },
  {
    product: pagoPa,
    guide: sanp,
    version: {
      name: '2.5.1',
      path: `${sanp.path}/2.5.1`,
    },
    source: {
      pathPrefix: `${sanp.path}/2.5.1`,
      assetsPrefix: `${docsAssetsPath}/P8TYVFYipQYir4JqodY3`,
      dirPath: `${docsPath}/P8TYVFYipQYir4JqodY3`,
    },
  },
  {
    product: pagoPa,
    guide: avvisi,
    version: {
      name: '3.1.0',
      path: `${avvisi.path}/3.1.0`,
    },
    source: {
      pathPrefix: `${avvisi.path}/3.1.0`,
      assetsPrefix: `${docsAssetsPath}/E9RM3F60OM97FbTVrCW8`,
      dirPath: `${docsPath}/E9RM3F60OM97FbTVrCW8`,
    },
  },
  // TODO: Uncomment once in sync
  // {
  //   product: pagoPa,
  //   guide: avvisi,
  //   version: {
  //     name: '3.0.0',
  //     path: `${avvisi.path}/3.0.0`,
  //   },
  //   source: {
  //     pathPrefix: `${avvisi.path}/3.0.0`,
  //     assetsPrefix: `${docsAssetsPath}/lph4boTulr49pD0pPBVM`,
  //     dirPath: `${docsPath}/lph4boTulr49pD0pPBVM`,
  //   },
  // },
  {
    product: pagoPa,
    guide: brand,
    version: {
      name: 'v1.0',
      path: `${brand.path}/v1.0`,
    },
    source: {
      pathPrefix: `${brand.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/8phwN5u2QXllSKsqBjQU`,
      dirPath: `${docsPath}/8phwN5u2QXllSKsqBjQU`,
    },
  },
  {
    product: pagoPa,
    guide: pda,
    version: {
      name: 'v4',
      path: `${pda.path}/v4`,
    },
    source: {
      pathPrefix: `${pda.path}/v4`,
      assetsPrefix: `${docsAssetsPath}/EQluaHvgNKaiHlsDcnrT`,
      dirPath: `${docsPath}/EQluaHvgNKaiHlsDcnrT`,
    },
  },
  {
    product: pagoPa,
    guide: pda,
    version: {
      name: 'v3',
      path: `${pda.path}/v3`,
    },
    source: {
      pathPrefix: `${pda.path}/v3`,
      assetsPrefix: `${docsAssetsPath}/19risPm7aBUnTS0sVhyR`,
      dirPath: `${docsPath}/19risPm7aBUnTS0sVhyR`,
    },
  },
  {
    product: pagoPa,
    guide: pda,
    version: {
      name: 'v2.2.5',
      path: `${pda.path}/v2.2.5`,
    },
    source: {
      pathPrefix: `${pda.path}/v2.2.5`,
      assetsPrefix: `${docsAssetsPath}/1phXXCgPXYbaIjTEs5C4`,
      dirPath: `${docsPath}/1phXXCgPXYbaIjTEs5C4`,
    },
  },
];

export const pagoPaGuides = pipe(
  docs,
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);
