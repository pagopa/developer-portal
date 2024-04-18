import { GuideListsData } from '@/lib/types/guideListsData';
import { pdnd } from '@/_contents/pdnd/pdnd';
import { pdndGuideListsPath } from '@/_contents/pdnd/guideListsPath';
import { pdndBannerLinks } from '@/_contents/pdnd/bannerLinks';

export const pdndGuideLists: GuideListsData = {
  ...pdndGuideListsPath,
  product: pdnd,
  abstract: {
    title: 'Guide e manuali',
    description:
      'Per una conoscenza approfondita o dubbi puntuali, consulta i manuali e le guide disponibili per PDND Interoperabilità.',
  },
  guidesSections: [
    {
      title: "Per l'integrazione",
      guides: [
        {
          title: 'Manuale operativo',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scopri come aderire a PDND Interoperabilità',
              'Richiedi e utilizza un voucher',
              'Sottoscrivi una richiesta di fruizione',
              'Crea e gestisci un e-service',
            ],
          },
          link: {
            href: `${pdndGuideListsPath.path}/manuale-operativo`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/manuale-operativo.png',
          mobileImagePath: '/images/manuale-operativo-mobile.png',
        },
      ],
    },
  ],
  bannerLinks: pdndBannerLinks,
};
