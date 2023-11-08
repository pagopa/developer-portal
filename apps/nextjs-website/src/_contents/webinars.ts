import { Webinar } from '@/lib/types/webinar';

export const webinars: readonly Webinar[] = [
  {
    title: 'Comunicazioni a valore legale: presente e futuro',
    description:
      'Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma e interagisci in modo semplice e sicuro con i cittadini. Raccogli tutti i servizi digitali del tuo ente in un’unica piattaforma.',
    path: '#',
    speakers: [
      {
        name: 'Anna Bianchi',
        jobTitle: 'Product Owner SEND',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
        imagePath: '/images/speaker-00.png',
      },
      {
        name: 'Mario Rossi',
        jobTitle: 'Software Engineer',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
        imagePath: '/images/speaker-01.png',
      },
    ],
    startDateTime: new Date('2024-12-31T11:00:00'),
    endDateTime: new Date('2024-12-31T13:00:00'),
  },
];
