import { OverviewData } from '@/lib/types/overviewData';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';

export const appIoOverview: OverviewData = {
  ...appIoOverviewPath,
  product: appIO,
  hero: {
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo onboarding@io.italia.it",
    },
    {
      theme: 'light',
      title: 'Dicci cosa ne pensi',
      decoration: 'HeadsetMic',
      body: "Per segnalare problemi o dare feedback, lascia un commento nello spazio Github dell'app IO",
    },
  ],
};
