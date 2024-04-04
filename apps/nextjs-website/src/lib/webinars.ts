import { StrapiWebinars } from '@/lib/strapi/webinars';
import { webinars } from '@/_contents/webinars';
import { Webinar } from './types/webinar';

export type WebinarsProps = readonly Webinar[];

type StaticWebinars = typeof webinars;

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars,
  staticWebinars: StaticWebinars
): WebinarsProps {
  return [
    ...staticWebinars,
    ...strapiWebinars.data.map((webinar) => ({
      ...webinar.attributes,
      speakers: webinar.attributes.webinarSpeakers.data.map((speaker) => ({
        ...speaker.attributes,
        avatar: speaker.attributes.avatar.data?.attributes,
      })),
      bodyContent: webinar.attributes.bodyContent,
      startDateTime: webinar.attributes.startDatetime?.toISOString(),
      endDateTime: webinar.attributes.endDatetime?.toISOString(),
      subscribeCtaLabel: webinar.attributes.subscribeParagraphLabel,
      //TODO: should be removed when this task https://pagopa.atlassian.net/browse/DEV-1524 is resolved
      isVisibleInHome: false,
      imagePath: webinar.attributes.coverImage.data.attributes.url,
    })),
  ];
}

export const makeWebinarsPropsFromStatic = (
  staticWebinars: StaticWebinars
): WebinarsProps => staticWebinars;
