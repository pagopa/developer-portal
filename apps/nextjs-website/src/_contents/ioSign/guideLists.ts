import { ioSign } from '@/_contents/ioSign/ioSign';
import { GuideListsData } from '@/lib/types/guideListsData';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';

export const ioSignGuideLists: GuideListsData = {
  ...ioSignGuideListsPath,
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
            href: `${ioSignGuideListsPath.path}/manuale-operativo/v1.0`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/guida-tecnica.png',
          mobileImagePath: '/images/guida-tecnica-mobile.png',
        },
      ],
    },
  ],
};
