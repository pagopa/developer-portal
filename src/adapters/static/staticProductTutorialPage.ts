import { ProductTutorial } from "@/domain/product";
import { staticProductOverviewPage } from "./staticProductOverviewPage";
import { staticProductQuickStartPage } from "./staticQuickStartPage";

export const staticProductTutorialPage: ProductTutorial = {
  product: staticProductQuickStartPage.product,
  title: 'Tutorial',
  description:
    'Firma con IO è una funzionalità che consente ai cittadini di firmare documenti e contratti tramite l’app IO in maniera semplice, veloce e sicura; agli enti di gestire tutti i processi di firma in un unico posto. In questa guida rapida apprenderai i passaggi di base per integrare rapidamente Firma con IO nel tuo servizio.',
  tutorial: {
    ...staticProductOverviewPage.tutorial,
    title: '',
  },
  related: staticProductQuickStartPage.related,
};
