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
      title: webinar.attributes.title,
      slug: webinar.attributes.slug,
      description: webinar.attributes.description,
      textContent: webinar.attributes.textContent,
      playerSrc: webinar.attributes.playerSrc,
      speakers: webinar.attributes.webinarSpeakers.data.map((speaker) => ({
        name: speaker.attributes.name,
        jobTitle: speaker.attributes.jobTitle,
        description: speaker.attributes.description,
        avatar: speaker.attributes.avatar.data?.attributes,
      })),
      startDateTime: webinar.attributes.startDatetime?.toISOString(),
      endDateTime: webinar.attributes.endDatetime?.toISOString(),
      relatedLinks: webinar.attributes.relatedLinks,
      subscribeCtaLabel: webinar.attributes.subscribeParagraphLabel,
      isVisibleInHome: false,
      isVisibleInList: webinar.attributes.isVisibleInList,
      imagePath: webinar.attributes.coverImage.data.attributes.url,
    })),
  ];
}

export const makeWebinarsPropsFromStatic = (
  staticWebinars: StaticWebinars
): WebinarsProps => staticWebinars;
