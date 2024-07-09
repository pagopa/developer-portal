import { StaticWebinar } from '@/lib/types/webinar';

const testWebinar: StaticWebinar = {
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
};

export const webinars: readonly StaticWebinar[] = [
  testWebinar,
  {
    ...testWebinar,
    startDateTime: '2024-03-13T13:00:00.000Z',
    slug: 'test-2024-03-13',
    endDateTime: '2024-03-13T14:00:00.000Z',
    playerSrc: 'https://vimeo.com/event/4153381/embed',
  },
  {
    ...testWebinar,
    startDateTime: '2024-03-10T13:00:00.000Z',
    slug: 'always-live',
    endDateTime: '2077-05-02T19:00:00.000Z',
    playerSrc: 'https://vimeo.com/event/4153381/embed',
  },
];
