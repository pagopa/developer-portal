import { QuickStartGuideData } from '@/lib/types/quickStartGuideData';
import { ioSignQuickStartGuidePath } from '@/_contents/ioSign/quickStartGuidePath';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignQuickStartGuide: QuickStartGuideData = {
  ...ioSignQuickStartGuidePath,
  product: ioSign,
  abstract: {
    title: 'Quick start',
    description:
      'In questa Quick Start apprenderai i passaggi di base per creare un dossier con la richiesta di firma, inviarla, ricevere i documenti firmati e integrare rapidamente Firma con IO nel tuo servizio.',
  },
  defaultStepAnchor: '01',
  steps: [],
  bannerLinks: ioSignBannerLinks,
};
