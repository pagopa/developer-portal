import { ioSign } from '@/_contents/ioSign/ioSign';
import { GuideListsData } from '@/lib/types/guideListsData';
import { ioSignGuideListsPath } from '@/_contents/ioSign/guideListsPath';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignGuideLists: GuideListsData = {
  ...ioSignGuideListsPath,
  product: ioSign,
  abstract: {
    title: 'Guide e manuali',
    description:
      'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per l’app IO.',
  },
  guidesSections: [
    {
      title: "Per l'integrazione",
      guides: [
        {
          title: 'Manuale operativo di Firma con IO',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              "Scopri cos'è e come funziona Firma con IO",
              'Crea un dossier e fallo firmare',
              'Scopri le modalità di installazione e utilizzo di Firma con IO',
              'Naviga fra le API',
            ],
          },
          link: {
            href: `${ioSignGuideListsPath.path}/manuale-operativo/latest`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/manuale-operativo.png',
          mobileImagePath: '/images/manuale-operativo-mobile.png',
        },
      ],
    },
  ],
  bannerLinks: ioSignBannerLinks,
};
