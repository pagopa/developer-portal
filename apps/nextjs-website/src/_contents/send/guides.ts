import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { send } from './send';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { makeGuide } from '../makeDocs';

const validatore = makeGuide({
  product: send,
  guide: {
    name: 'Validatore',
    slug: 'validatore',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'niZ9BM7pjxsgBMMWBim1',
    },
  ],
});

const manualeOperativo = makeGuide({
  product: send,
  guide: {
    name: 'Manuale Operativo',
    slug: `manuale-operativo`,
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'oBwhR0C1TZjRAwNbGVus',
    },
    // TODO: Uncomment once in sync
    // {
    //   version: 'v1.0.1',
    //   dirName: 'E1H8qAvYcaMYhDZ2iIp5',
    // },
  ],
});

const knowledgeBase = makeGuide({
  product: send,
  guide: {
    name: 'Knowledge-base di Send',
    slug: `knowledge-base`,
  },
  versions: [
    {
      version: 'v1.0',
      dirName: '8hvzBYw259fYwQSqzmf6',
    },
  ],
});

const modelloDiIntegrazione = makeGuide({
  product: send,
  guide: {
    name: 'Modello di integrazione',
    slug: `modello-di-integrazione`,
  },
  versions: [
    {
      version: 'v1.0',
      dirName: '4QKqt9mkQAzNdmxbW9Ab',
    },
    // TODO: Uncomment once in sync
    // {
    //   version: 'v2.0',
    //   dirName: 'TmWy4VGVx84G3qBQqH89',
    // },
  ],
});

export const sendGuides = pipe(
  [
    ...validatore,
    ...manualeOperativo,
    ...knowledgeBase,
    ...modelloDiIntegrazione,
  ],
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);
