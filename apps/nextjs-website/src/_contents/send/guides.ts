import { send } from './send';
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
    name: 'Knowledge-base di SEND',
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

export const sendGuides = [
  ...validatore,
  ...manualeOperativo,
  ...knowledgeBase,
  ...modelloDiIntegrazione,
];
