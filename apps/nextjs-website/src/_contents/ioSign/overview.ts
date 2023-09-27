import { OverviewData } from '@/lib/types/overviewData';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignOverviewPath } from '@/_contents/ioSign/overviewPath';
import { ioSignTutorials } from '@/_contents/ioSign/tutorialLists';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';
import { ioSignQuickStartGuidePath } from './quickStartGuidePath';

export const ioSignOverview: OverviewData = {
  ...ioSignOverviewPath,
  product: ioSign,
  hero: {
    altText: 'Hero: Richiedi la firma di contratti e documenti',
    backgroundImage: '/images/hero.jpg',
    title: 'Richiedi la firma di contratti e documenti',
    subtitle:
      'Con Firma con IO puoi inviare alle cittadine e ai cittadini documenti e contratti e richiedere loro di firmarli digitalmente in modo facile, veloce e sicuro.',
  },
  feature: {
    title: 'Perché Firma con IO',
    subtitle:
      'Che tu sia un ente pubblico, centrale o locale, tramite Firma con IO potrai:',
    items: [
      {
        iconName: 'MessageRounded',
        subtitle:
          'Invia un messaggio con i documenti da firmare e indica una scadenza. Inoltra la richiesta di firma ai tuoi utenti nel modo che preferisci',
        title: "Richiedere una firma tramite l'app IO",
      },
      {
        iconName: 'PaymentsRounded',
        subtitle:
          'Richiedi la firma di uno o più documenti direttamente sul tuo sito web, attraverso un pulsante dedicato che permette di aprire i documenti su IO e completare l’operazione',
        title: 'Richiedere una firma direttamente sul tuo sito',
      },
      {
        iconName: 'CreateRounded',
        subtitle:
          'Una firma totalmente da remoto e con massima validità legale. Erogata attraverso un canale già noto e affidabile, nel modo più semplice possibile',
        title: 'Ottenere firme digitali con valore legale',
      },
    ],
  },
  startInfo: {
    cards: [
      {
        title: 'Quick Start',
        text: 'Sei semplici passi per inviare e ricevere un documento firmato digitalmente',
        href: `${ioSignQuickStartGuidePath.path}`,
        iconName: 'FlagOutlined',
      },
      {
        title: 'Documentazione API',
        text: "Esplora le API Rest per l'invio delle richieste di firma e per la raccolta dei documenti firmati",
        href: ioSign.subpaths.api?.path ?? '#',
        iconName: 'FolderOutlined',
      },
    ],
  },
  tutorials: {
    subtitle:
      'Cosa serve per preparare il documento da firmare? Come si crea una richiesta di firma? Risolvi ogni dubbio con questi brevi tutorial.',
    list: ioSignTutorials,
  },
  bannerLinks: ioSignBannerLinks,
};
