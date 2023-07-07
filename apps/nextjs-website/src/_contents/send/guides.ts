import { send } from './send';
import { makeGuide } from '../makeDocs';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

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
  bannerLinks: sendBannerLinks,
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
  bannerLinks: sendBannerLinks,
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
  bannerLinks: sendBannerLinks,
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
    {
      version: 'v2.0',
      dirName: 'TmWy4VGVx84G3qBQqH89',
    },
  ],
  bannerLinks: sendBannerLinks,
});

export const sendGuides = [
  ...validatore,
  ...manualeOperativo,
  ...knowledgeBase,
  ...modelloDiIntegrazione,
];
