import { ApiPageProps } from '@/components/molecules/ApiSection/ApiSection';
import { baseUrl, organizationInfo, websiteName } from '@/config';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { Webinar } from '@/lib/types/webinar';
import {
  Article,
  BreadcrumbList,
  Event,
  FAQPage,
  HowTo,
  ImageObject,
  ListItem,
  MonetaryAmount,
  Offer,
  Organization,
  SoftwareApplication,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

export const organization: Organization = {
  '@type': 'Organization',
  ...organizationInfo,
};

export const organizationWithContext: WithContext<Organization> = {
  '@context': 'https://schema.org',
  ...organization,
};

export const website: WebSite = {
  '@type': 'WebSite',
  name: websiteName,
  url: baseUrl,
};

export const websiteWithContext: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  ...website,
};

export type StructuredDataBreadcrumbList = readonly Pick<
  ListItem,
  'name' | 'item'
>[];

export function makeBreadcrumbList(
  items: StructuredDataBreadcrumbList
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      ...item,
    })),
  };
}

export type StructuredDataMedia = Partial<
  Pick<Media, 'url' | 'width' | 'height'>
>;

function mediaToImageObject(media: StructuredDataMedia): ImageObject {
  return {
    '@type': 'ImageObject',
    url: media.url,
    width: `${media.width}`,
    height: `${media.height}`,
  };
}

export type StructuredDataWebPage = Omit<WebPage, '@type'> & {
  readonly media?: StructuredDataMedia;
};

export function makeWebPage(
  webPage: StructuredDataWebPage
): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...webPage,
    isPartOf: webPage.isPartOf || website,
    author: webPage.author || organization,
    image:
      webPage.image ||
      (webPage.media ? mediaToImageObject(webPage.media) : undefined),
  };
}

export function makeFAQPage(
  faqs: ReadonlyArray<{
    readonly question: string;
    readonly answer: string;
  }>
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

const defaultMonetaryAmount: MonetaryAmount = {
  '@type': 'MonetaryAmount',
  currency: 'EUR',
  value: '0',
};

export function makeHowTo(howTo: Omit<HowTo, '@type'>): WithContext<HowTo> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    ...howTo,
    estimatedCost: defaultMonetaryAmount,
  };
}

const defaultOffers: Offer = {
  '@type': 'Offer',
  price: '0',
  availability: 'https://schema.org/InStock',
};

export function makeEvent(event: Omit<Event, '@type'>): WithContext<Event> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    ...event,
    offers: event.offers || defaultOffers,
  };
}

export function convertWebinarToStracturedDataEvent(
  webinar: Webinar
): WithContext<Event> {
  return makeEvent({
    name: webinar.title,
    startDate: webinar.startDateTime,
    endDate: webinar.endDateTime,
    eventStatus: 'https://schema.org/EventScheduled',
    description: webinar.description,
    image: webinar.imagePath,
    offers: defaultOffers,
    organizer: organization,
    location: {
      '@type': 'VirtualLocation',
      url: `${baseUrl}/webinars/${webinar.slug}`,
    },
    performers: webinar.speakers?.map((speaker) => ({
      '@type': 'Person',
      name: speaker.name,
      jobTitle: speaker.jobTitle,
      image: speaker.avatar ? mediaToImageObject(speaker.avatar) : undefined,
    })),
  });
}

export function makeSoftwareApplication(
  softwareApplication: Omit<SoftwareApplication, '@type'>
): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    ...softwareApplication,
    applicationCategory: 'Business',
    offers: defaultOffers,
  };
}

export function convertApiToStructuredDataSoftwareApplication(
  api: ApiPageProps
): WithContext<SoftwareApplication> {
  return makeSoftwareApplication({
    name: api.specURLsName,
    url: `${baseUrl}/${api.product.slug}/api/${api.apiSlug}`,
  });
}

export function makeArticle(article: Omit<Article, '@type'>): Article {
  return {
    '@type': 'Article',
    ...article,
  };
}
