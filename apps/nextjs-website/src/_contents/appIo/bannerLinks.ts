import { BannerLinkProps } from '@/editorialComponents/BannerLink';

export const appIoBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    title: 'Hai bisogno di aiuto?',
    decoration: 'HeadsetMic',
    body: "Scrivi un'email in cui descrivi il tuo problema o dubbio all'indirizzo <strong>onboarding@io.italia.it</strong>",
  },
  {
    theme: 'light',
    title: 'Dicci cosa ne pensi',
    decoration: 'Feedback',
    body: "Per segnalare problemi o dare feedback, lascia un commento nello <strong>spazio Github</strong> dell'app IO",
  },
];
