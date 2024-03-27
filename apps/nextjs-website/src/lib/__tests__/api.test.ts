// import { webinars as contentWebinars } from '@/_contents/webinars';
// import {
//   getFutureWebinars,
//   getPastWebinars,
//   getVisibleInHomeWebinars,
//   getVisibleInListWebinars,
//   getWebinar,
//   getWebinars,
// } from '../api';
// import { Webinar } from '../types/webinar';

// const testWebinar: Webinar = {
//   title: 'Test Webinar',
//   description: 'Questo è un webinar di test',
//   playerSrc: 'https://vimeo.com/event/4135276/embed',
//   html:
//     `<h4 style="font-weight: 600; font-size: 24px;">Test Webinar</h4>\n` +
//     `<p>Questo è un webinar di test</p>\n` +
//     `<br />\n` +
//     `<br />\n` +
//     `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor enim vel sem fringilla, vitae malesuada nisi malesuada. Sed euismod augue id mauris aliquam, at dapibus lectus laoreet. Sed vel nulla vel risus gravida malesuada ac id tortor. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi. Sed euismod, risus eget bibendum bibendum, quam nisi aliquam nisi, id congue lorem risus id nisi.</p>\n`,
//   slug: 'test-2024-03-14',
//   isVisibleInHome: false,
//   isVisibleInList: false,
//   imagePath: '/images/webinar-cover-pago-pa-multe-14-marzo.jpg',
//   speakers: [],
//   startDateTime: '2024-03-14T08:30:00.000Z',
//   endDateTime: '2024-03-14T09:30:00.000Z',
//   subscribeCtaLabel: '',
//   relatedLinks: [
//     {
//       path: `#`,
//       name: 'Lorem ipsum dolor sit amet',
//     },
//   ],
// };

// const webinars: readonly Webinar[] = [
//   {
//     ...testWebinar,
//     startDateTime: '2022-01-01T08:30:00.000Z',
//   },
//   {
//     ...testWebinar,
//     startDateTime: '2024-03-04T08:30:00.000Z',
//   },
//   {
//     ...testWebinar,
//     startDateTime: '2099-01-01T08:30:00.000Z',
//   },
// ];

// describe('getWebinars', () => {
//   it('should return all webinars', async () => {
//     expect(await getWebinars()).toStrictEqual(contentWebinars);
//   });
// });

// describe('getVisibleInHomeWebinars', () => {
//   it('should return only webinars visible in home', async () => {
//     const visibleInHomeWebinars = contentWebinars.filter(
//       (webinar) => webinar.isVisibleInHome
//     );
//     expect(await getVisibleInHomeWebinars()).toStrictEqual(
//       visibleInHomeWebinars
//     );
//   });
// });

// describe('getFutureWebinars', () => {
//   it('should return only future webinars', () => {
//     expect(getFutureWebinars(webinars)).toStrictEqual([
//       {
//         ...testWebinar,
//         startDateTime: '2099-01-01T08:30:00.000Z',
//       },
//     ]);
//   });
// });

// describe('getPastWebinars', () => {
//   it('should return only past webinars', () => {
//     expect(getPastWebinars(webinars)).toStrictEqual([
//       {
//         ...testWebinar,
//         startDateTime: '2024-03-04T08:30:00.000Z',
//       },
//       {
//         ...testWebinar,
//         startDateTime: '2022-01-01T08:30:00.000Z',
//       },
//     ]);
//   });
// });

// describe('getVisibleInListWebinars', () => {
//   it('should return only webinars visible in list', async () => {
//     const visibleInListWebinars = contentWebinars.filter(
//       (webinar) => webinar.isVisibleInList
//     );
//     expect(await getVisibleInListWebinars()).toStrictEqual(
//       visibleInListWebinars
//     );
//   });
// });

// describe('getWebinar', () => {
//   it('should return a webinar by slug', async () => {
//     const webinar = contentWebinars[0];
//     const slug = webinar.slug;
//     expect(await getWebinar(slug)).toStrictEqual(webinar);
//   });

//   it('should throw an error if the webinar does not exist', async () => {
//     const slug = 'not-exist';
//     expect(await getWebinar(slug)).toThrow('Failed to fetch data');
//   });
// });
