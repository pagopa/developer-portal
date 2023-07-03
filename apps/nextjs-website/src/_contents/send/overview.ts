import { OverviewData } from '@/lib/types/overviewData';
import { send } from '@/_contents/send/send';
import { sendOverviewPath } from '@/_contents/send/overviewPath';

export const sendOverview: OverviewData = {
  ...sendOverviewPath,
  product: send,
  hero: {
    title: 'Gestisci le notifiche in modo più semplice',
    subtitle:
      'Digitalizza e semplifica il modo in cui il tuo ente gestisce le comunicazioni a valore legale. Integrandoti con SEND, ti basterà depositare gli atti da notificare: sarà la piattaforma a occuparsi del loro invio, per via digitale o analogica.',
  },
};
