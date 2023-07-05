import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { send } from './send';
import { parseDoc } from 'gitbook-docs/parseDoc';

const validatore = {
  name: 'Validatore',
  path: `${send.path}/guides/validatore`,
};

const manualeOperativo = {
  name: 'Manuale Operativo',
  path: `${send.path}/guides/manuale-operativo`,
};

const knowledgeBase = {
  name: 'Knowledge-base di Send',
  path: `${send.path}/guides/knowledge-base`,
};

const modelloDiIntegrazione = {
  name: 'Modello di integrazione',
  path: `${send.path}/guides/modello-di-integrazione`,
};

const docs = [
  {
    product: send,
    guide: validatore,
    version: {
      name: 'v1.0',
      path: `${validatore.path}/v1.0`,
    },
    source: {
      pathPrefix: `${validatore.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/niZ9BM7pjxsgBMMWBim1`,
      dirPath: `${docsPath}/niZ9BM7pjxsgBMMWBim1`,
    },
  },
  {
    product: send,
    guide: manualeOperativo,
    version: {
      name: 'v1.0',
      path: `${manualeOperativo.path}/v1.0`,
    },
    source: {
      pathPrefix: `${manualeOperativo.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/oBwhR0C1TZjRAwNbGVus`,
      dirPath: `${docsPath}/oBwhR0C1TZjRAwNbGVus`,
    },
  },
  // TODO: Uncomment once in sync
  // {
  //   product: send,
  //   guide: manualeOperativo,
  //   version: {
  //     name: 'v1.0.1',
  //     path: `${manualeOperativo.path}/v1.0.1`,
  //   },
  //   source: {
  //     pathPrefix: `${manualeOperativo.path}/v1.0.1`,
  //     assetsPrefix: `${docsAssetsPath}/E1H8qAvYcaMYhDZ2iIp5`,
  //     dirPath: `${docsPath}/E1H8qAvYcaMYhDZ2iIp5`,
  //   },
  // },
  {
    product: send,
    guide: knowledgeBase,
    version: {
      name: 'v1.0',
      path: `${knowledgeBase.path}/v1.0`,
    },
    source: {
      pathPrefix: `${knowledgeBase.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/8hvzBYw259fYwQSqzmf6`,
      dirPath: `${docsPath}/8hvzBYw259fYwQSqzmf6`,
    },
  },
  {
    product: send,
    guide: modelloDiIntegrazione,
    version: {
      name: 'v1.0',
      path: `${modelloDiIntegrazione.path}/v1.0`,
    },
    source: {
      pathPrefix: `${modelloDiIntegrazione.path}/v1.0`,
      assetsPrefix: `${docsAssetsPath}/4QKqt9mkQAzNdmxbW9Ab`,
      dirPath: `${docsPath}/4QKqt9mkQAzNdmxbW9Ab`,
    },
  },
  // TODO: Uncomment once in sync
  // {
  //   product: send,
  //   guide: modelloDiIntegrazione,
  //   version: {
  //     name: 'v2.0',
  //     path: `${modelloDiIntegrazione.path}/v2.0`,
  //   },
  //   source: {
  //     pathPrefix: `${modelloDiIntegrazione.path}/v2.0`,
  //     assetsPrefix: `${docsAssetsPath}/TmWy4VGVx84G3qBQqH89`,
  //     dirPath: `${docsPath}/TmWy4VGVx84G3qBQqH89`,
  //   },
  // },
];

export const sendGuides = pipe(
  docs,
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);
