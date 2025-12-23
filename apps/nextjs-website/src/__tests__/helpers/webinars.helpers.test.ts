import {
  getFutureWebinarsFrom,
  getPastWebinarsFrom,
} from '@/helpers/webinars.helpers';
import { Webinar } from '@/lib/types/webinar';
import { mediaRasterJson } from '@/lib/strapi/__tests__/fixtures/media';

const testWebinar: Webinar = {
  title: 'Test Webinar',
  updatedAt: '2024-03-14T08:30:00.000Z',
  description: 'Questo è un webinar di test',
  playerSrc: 'https://vimeo.com/event/4135276/embed',
  bodyContent: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'aText',
        },
      ],
    },
    {
      type: 'image',
      image: mediaRasterJson,
      children: [
        {
          type: 'text',
          text: '',
        },
      ],
    },
  ],
  slug: 'test-2024-03-14',
  isVisibleInList: false,
  imagePath: '/images/webinar-cover-pago-pa-multe-14-marzo.jpg',
  speakers: [],
  startDateTime: '2024-03-14T08:30:00.000Z',
  endDateTime: '2024-03-14T09:30:00.000Z',
  subscribeCtaLabel: '',
  relatedLinks: {
    title: 'Link Utili',
    links: [
      {
        href: `#`,
        text: 'Lorem ipsum dolor sit amet',
      },
    ],
  },
};

const webinars: readonly Webinar[] = [
  {
    ...testWebinar,
    startDateTime: '2022-01-01T08:30:00.000Z',
    endDateTime: '2022-01-01T09:30:00.000Z',
  },
  {
    ...testWebinar,
    startDateTime: '2024-03-04T08:30:00.000Z',
    endDateTime: '2024-03-04T09:30:00.000Z',
  },
  {
    ...testWebinar,
    startDateTime: '2099-01-01T08:30:00.000Z',
    endDateTime: '2099-01-01T09:30:00.000Z',
  },
];

describe('getFutureWebinars', () => {
  it('should return only future webinars', () => {
    expect(getFutureWebinarsFrom(webinars)).toStrictEqual([
      {
        ...testWebinar,
        startDateTime: '2099-01-01T08:30:00.000Z',
        endDateTime: '2099-01-01T09:30:00.000Z',
      },
    ]);
  });
});

describe('getPastWebinars', () => {
  it('should return only past webinars', () => {
    expect(getPastWebinarsFrom(webinars)).toStrictEqual([
      {
        ...testWebinar,
        startDateTime: '2024-03-04T08:30:00.000Z',
        endDateTime: '2024-03-04T09:30:00.000Z',
      },
      {
        ...testWebinar,
        startDateTime: '2022-01-01T08:30:00.000Z',
        endDateTime: '2022-01-01T09:30:00.000Z',
      },
    ]);
  });
});
