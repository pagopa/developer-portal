import { mockText } from '../mock-content.helper';

const lightBannerLinkFixture = {
  id: 3,
  title: mockText(10),
  content: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Per chiarimenti sulle specifiche d’implementazione, come SACI e SANP, puoi aprire una segnalazione su ',
          type: 'text',
        },
        {
          url: 'https://github.com/pagopa/pagopa-api/issues',
          type: 'link',
          children: [{ text: 'GitHub', type: 'text' }],
        },
        { text: '', type: 'text' },
      ],
    },
  ],
  theme: 'light',
  subtitle: null,
  icon: {
    name: 'feedback.svg',
    alternativeText: null,
    caption: null,
    width: 60,
    height: 61,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: '/icons/feedback.svg',
  },
};

const darkBannerLinkFixture = {
  id: 2,
  title: mockText(10),
  content: [
    {
      type: 'paragraph',
      children: [
        {
          text: mockText(60),
          type: 'text',
        },
        {
          url: 'https://selfcare.pagopa.it/auth/login?onSuccess=%2F',
          type: 'link',
          children: [{ bold: true, text: 'Area Riservata', type: 'text' }],
        },
        { text: '', type: 'text' },
      ],
    },
  ],
  theme: 'dark',
  subtitle: null,
  icon: {
    name: 'headset.svg',
    alternativeText: null,
    caption: null,
    width: 60,
    height: 61,
    size: 0.54,
    ext: '.svg',
    mime: 'image/svg+xml',
    url: '/icons/headset.svg',
  },
};

export const bannerLinksFixture = [
  lightBannerLinkFixture,
  darkBannerLinkFixture,
];
