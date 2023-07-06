import { ioSign } from './ioSign';
import { makeGuide } from '../makeDocs';

const manualeOperativo = makeGuide({
  product: ioSign,
  guide: {
    name: 'Manuale Operativo',
    slug: 'manuale-operativo',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'AdBuOCmwur7AhLlgfCeG',
    },
  ],
});

export const ioSignGuides = manualeOperativo;
