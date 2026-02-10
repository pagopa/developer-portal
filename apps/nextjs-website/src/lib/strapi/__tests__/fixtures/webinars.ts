import { Webinar } from '@/lib/types/webinar';
import { StrapiWebinars } from '@/lib/strapi/types/webinars';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';

export const webinarSpeaker = {
  id: 1,
  name: 'Speaker Name',
  jobTitle: 'Speaker Job',
  publishedAt: '2024-01-01T00:00:00.000Z',
  description: undefined,
  avatar: {
    ...mediaJpeg(),
    name: 'avatar.jpg',
  },
};

export const resource = {
  title: 'Resource Title',
  linkText: 'Resource Link',
  linkHref: '/resource-link',
  subtitle: 'Resource Subtitle',
  description: undefined,
  image: {
    ...mediaJpeg(),
    name: 'resource.jpg',
  },
};

export const downloadableDocument = {
  caption: 'Doc Caption',
  name: 'doc.pdf',
  mime: 'text/html',
  url: '/docs/doc.pdf',
  size: 12345,
  ext: '.pdf',
};

export const strapiWebinars: StrapiWebinars = {
  data: [
    {
      id: 1,
      title: 'Webinar Title',
      description: 'Webinar Description',
      slug: 'webinar-title',
      publishedAt: '2024-01-01T00:00:00.000Z',
      isVisibleInList: true,
      coverImage: {
        ...mediaJpeg(),
        name: 'cover.jpg',
      },
      bodyContent: undefined,
      playerSrc: 'https://player.example.com',
      startDatetime: '2024-01-10T10:00:00.000Z',
      endDatetime: '2024-01-10T12:00:00.000Z',
      subscribeParagraphLabel: 'Subscribe Now',
      relatedLinks: undefined,
      relatedResources: {
        title: 'Related Resources',
        resources: [resource],
        downloadableDocuments: [downloadableDocument],
      },
      webinarSpeakers: [webinarSpeaker],
      questionsAndAnswers: [
        {
          question: 'What is this webinar about?',
          answer: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'It is about testing.' }],
            },
          ],
        },
      ],
      seo: { metaTitle: 'SEO Webinar', metaDescription: 'SEO Description' },
      webinarCategory: {
        id: 1,
        name: 'Category 1',
        icon: { ...mediaJpeg() },
      },
      headerImage: {
        ...mediaJpeg(),
        name: 'header.jpg',
      },
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
};

export const strapiWebinarsWithMissingData: StrapiWebinars = {
  data: [
    ...strapiWebinars.data,
    {
      id: 2,
      title: 'Minimal Webinar',
      description: 'Minimal Description',
      slug: 'minimal-webinar',
      publishedAt: '2024-01-01T00:00:00.000Z',
      isVisibleInList: true,
      coverImage: {
        url: 'https://example.com/minimal.jpg',
        name: 'minimal.jpg',
        ext: '',
        mime: '',
        size: 0,
      },
      webinarSpeakers: [],
      updatedAt: '2024-01-02T00:00:00.000Z',
      webinarCategory: {
        id: 1,
        name: 'Category 1',
        icon: { ...mediaJpeg() },
      },
      headerImage: {
        ...mediaJpeg(),
        name: 'header.jpg',
      },
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
};

export const webinarProps = {
  title: 'Webinar Title',
  description: 'Webinar Description',
  slug: 'webinar-title',
  isVisibleInList: true,
  speakers: [
    {
      name: 'Speaker Name',
      jobTitle: 'Speaker Job',
      avatar: {
        ...mediaJpeg(),
        name: 'avatar.jpg',
      },
    },
  ],
  relatedResources: {
    title: 'Related Resources',
    resources: [
      {
        title: 'Resource Title',
        linkText: 'Resource Link',
        linkHref: '/resource-link',
        subtitle: 'Resource Subtitle',
        image: {
          ...mediaJpeg(),
          name: 'resource.jpg',
        },
      },
    ],
    downloadableDocuments: [
      {
        title: 'Doc Caption',
        downloadLink: '/docs/doc.pdf',
        size: 12345,
        extension: 'PDF',
      },
    ],
  },
  startDateTime: '2024-01-10T10:00:00.000Z',
  endDateTime: '2024-01-10T12:00:00.000Z',
  subscribeCtaLabel: 'Subscribe Now',
  imagePath: 'https://example.com/example.jpg',
  seo: { metaTitle: 'SEO Webinar', metaDescription: 'SEO Description' },
  tag: {
    name: 'Category 1',
    icon: {
      ...mediaJpeg(),
      name: 'example.jpg',
    },
  },
  headerImage: {
    ...mediaJpeg(),
    name: 'header.jpg',
  },
  updatedAt: '2024-01-02T00:00:00.000Z',
} satisfies Webinar;
