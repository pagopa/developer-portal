import { getFutureWebinars, getPastWebinars } from '@/helpers/webinars.helpers';
import { Webinar } from '@/lib/types/webinar';

const testWebinar: Webinar = {
  title: 'Test Webinar',
  description: 'Questo è un webinar di test',
  playerSrc: 'https://vimeo.com/event/4135276/embed',
  html:
    `<h4 style="font-weight: 600; font-size: 24px;">Test Webinar</h4>\n` +
    `<p>Questo è un webinar di test</p>\n` +
    `<br />\n` +
    `<br />\n` +
    `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor enim vel sem fringilla, vitae malesuada nisi malesuada. Sed euismod augue id mauris aliquam, at dapibus lectus laoreet. Sed vel nulla vel risus gravida malesuada ac id tortor. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi.</p>\n`,
  slug: 'test-2024-03-14',
  isVisibleInHome: false,
  isVisibleInList: false,
  imagePath: '/images/webinar-cover-pago-pa-multe-14-marzo.jpg',
  speakers: [],
  startDateTime: '2024-03-14T08:30:00.000Z',
  endDateTime: '2024-03-14T09:30:00.000Z',
  subscribeCtaLabel: '',
  relatedLinks: [
    {
      path: `#`,
      name: 'Lorem ipsum dolor sit amet',
    },
  ],
};

const webinars: readonly Webinar[] = [
  {
    ...testWebinar,
    startDateTime: '2022-01-01T08:30:00.000Z',
  },
  {
    ...testWebinar,
    startDateTime: '2024-03-04T08:30:00.000Z',
  },
  {
    ...testWebinar,
    startDateTime: '2099-01-01T08:30:00.000Z',
  },
];

describe('getFutureWebinars', () => {
  it('should return only future webinars', () => {
    expect(getFutureWebinars(webinars)).toStrictEqual([
      {
        ...testWebinar,
        startDateTime: '2099-01-01T08:30:00.000Z',
      },
    ]);
  });
});

describe('getPastWebinars', () => {
  it('should return only past webinars', () => {
    expect(getPastWebinars(webinars)).toStrictEqual([
      {
        ...testWebinar,
        startDateTime: '2024-03-04T08:30:00.000Z',
      },
      {
        ...testWebinar,
        startDateTime: '2022-01-01T08:30:00.000Z',
      },
    ]);
  });
});
