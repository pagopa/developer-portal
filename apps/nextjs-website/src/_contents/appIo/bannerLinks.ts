import { BannerLinkProps } from '@/editorialComponents/BannerLink';

export const appIoBannerLinks: readonly BannerLinkProps[] = [
  {
    theme: 'dark',
    title: 'Hai bisogno di aiuto?',
    decoration: 'HeadsetMic',
    body: 'Scrivi un’email in cui descrivi il tuo problema o dubbio all’indirizzo <a href="mailto:onboarding@io.italia.it">onboarding@io.italia.it</a>',
  },
  {
    theme: 'light',
    title: 'Dicci cosa ne pensi',
    decoration: 'Feedback',
    body: 'Per segnalare problemi o dare feedback, lascia un commento nello <a href="https://github.com/pagopa/io-app/issues/new/choose">spazio Github</a> dell’app IO',
  },
];
