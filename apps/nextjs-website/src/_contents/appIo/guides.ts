import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { appIO } from './appIO';
import { parseDoc } from 'gitbook-docs/parseDoc';

const guidaTecnica = {
  name: 'Guida tecnica',
  path: `${appIO.path}/guides/guida-tecnica`,
};

const manualeDeiServizi = {
  name: "Manuale dei servizi dell'app IO",
  path: `${appIO.path}/guides/manuale-dei-servizi`,
};

const supportoAgliEnti = {
  name: 'Supporto agli enti',
  path: `${appIO.path}/guides/supporto-agli-enti`,
};

const kitDiComunicazione = {
  name: 'Kit di comunicazione',
  path: `${appIO.path}/guides/kit-comunicazione`,
};

const docs = [
  {
    product: appIO,
    guide: guidaTecnica,
    version: {
      name: 'v2.4',
      path: `${guidaTecnica.path}/v2.4`,
    },
    source: {
      pathPrefix: `${guidaTecnica.path}/v2.4`,
      assetsPrefix: `${docsAssetsPath}/r65fve0XPThNw1ljBi57`,
      dirPath: `${docsPath}/r65fve0XPThNw1ljBi57`,
    },
  },
  {
    product: appIO,
    guide: guidaTecnica,
    version: {
      name: 'v2.3',
      path: `${guidaTecnica.path}/v2.3`,
    },
    source: {
      pathPrefix: `${guidaTecnica.path}/v2.3`,
      assetsPrefix: `${docsAssetsPath}/mzwjFv2XaE1mjbz7I8gt`,
      dirPath: `${docsPath}/mzwjFv2XaE1mjbz7I8gt`,
    },
  },
  {
    product: appIO,
    guide: guidaTecnica,
    version: {
      name: 'v2.2',
      path: `${guidaTecnica.path}/v2.2`,
    },
    source: {
      pathPrefix: `${guidaTecnica.path}/v2.2`,
      assetsPrefix: `${docsAssetsPath}/coSKRte21UjDBRWKLtEs`,
      dirPath: `${docsPath}/coSKRte21UjDBRWKLtEs`,
    },
  },
  {
    product: appIO,
    guide: guidaTecnica,
    version: {
      name: 'v1.3',
      path: `${guidaTecnica.path}/v1.3`,
    },
    source: {
      pathPrefix: `${guidaTecnica.path}/v1.3`,
      assetsPrefix: `${docsAssetsPath}/OoU8rMn4ZUWvfkSueJIl`,
      dirPath: `${docsPath}/OoU8rMn4ZUWvfkSueJIl`,
    },
  },
  {
    product: appIO,
    guide: guidaTecnica,
    version: {
      name: 'v1.2',
      path: `${guidaTecnica.path}/v1.2`,
    },
    source: {
      pathPrefix: `${guidaTecnica.path}/v1.2`,
      assetsPrefix: `${docsAssetsPath}/DOaGsRYKzkZYmIAbjNII`,
      dirPath: `${docsPath}/DOaGsRYKzkZYmIAbjNII`,
    },
  },
  {
    product: appIO,
    guide: manualeDeiServizi,
    version: {
      name: 'v1.0',
      path: `${manualeDeiServizi.path}/v1.0`,
    },
    source: {
      pathPrefix: `${manualeDeiServizi.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/zcLztiq5qDSVw9rRjW7p`,
      dirPath: `${docsPath}/zcLztiq5qDSVw9rRjW7p`,
    },
  },
  {
    product: appIO,
    guide: supportoAgliEnti,
    version: {
      name: 'v1.0',
      path: `${supportoAgliEnti.path}/v1.0`,
    },
    source: {
      pathPrefix: `${supportoAgliEnti.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/rPr79NYJ4xbKA7EvgHxo`,
      dirPath: `${docsPath}/rPr79NYJ4xbKA7EvgHxo`,
    },
  },
  {
    product: appIO,
    guide: kitDiComunicazione,
    version: {
      name: 'v1.0',
      path: `${kitDiComunicazione.path}/v1.0`,
    },
    source: {
      pathPrefix: `${kitDiComunicazione.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/SpNLdqKSqoCvaOneGN7K`,
      dirPath: `${docsPath}/SpNLdqKSqoCvaOneGN7K`,
    },
  },
];

export const appIoGuides = pipe(
  docs,
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);
