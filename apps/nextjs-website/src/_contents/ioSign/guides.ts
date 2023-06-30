import { ioSign } from '@/_contents/ioSign/ioSign';
import { GuidesData } from '@/lib/types/guidesData';
import { ioSignGuidesPath } from '@/_contents/ioSign/guidesPath';

export const ioSignGuides: GuidesData = {
  ...ioSignGuidesPath,
  product: ioSign,
  abstract: {
    title: 'Richiedi la firma di contratti e documenti',
    description:
      'Con Firma con IO puoi inviare alle cittadine e ai cittadini documenti e contratti e richiedere loro di firmarli digitalmente in modo facile, veloce e sicuro.',
  },
  guidesSections: [
    {
      title: "Per l'utilizzo",
      guides: [
        {
          title: 'Manuale operativo di Firma con IO',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scopri cos`è e come funziona Firma con IO',
              'Crea un dossier e fallo firmare',
              'Scopri le modalità di installazione e utilizzo di Firma con IO',
              'Naviga fra le API',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/guida-tecnica.png',
        },
      ],
    },
  ],
};
