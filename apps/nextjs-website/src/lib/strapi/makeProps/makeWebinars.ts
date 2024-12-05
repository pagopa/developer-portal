import { StrapiWebinars } from '@/lib/strapi/codecs/WebinarsCodec';
import { Webinar } from '../../types/webinar';

export type WebinarsProps = readonly Webinar[];

export const makeWebinarFromStrapi = (
  strapiWebinar: StrapiWebinars['data'][0]
): Webinar => {
  return {
    ...strapiWebinar.attributes,
    speakers:
      strapiWebinar.attributes.webinarSpeakers.data.length > 0
        ? strapiWebinar.attributes.webinarSpeakers.data.map((speaker) => ({
            ...speaker.attributes,
            avatar: speaker.attributes.avatar.data?.attributes,
          }))
        : undefined,
    questionsAndAnswers:
      strapiWebinar.attributes.questionsAndAnswers.length > 0
        ? strapiWebinar.attributes.questionsAndAnswers
        : undefined,
    relatedResources: strapiWebinar.attributes.relatedResources
      ? {
          title: strapiWebinar.attributes.relatedResources.title,
          resources: (
            strapiWebinar.attributes.relatedResources.resources || []
          ).map((resource) => ({
            ...resource,
            image: resource.image.data?.attributes,
          })),
          downloadableDocuments: (
            strapiWebinar.attributes.relatedResources.downloadableDocuments
              .data || []
          ).map(({ attributes }) => ({
            title: attributes.caption || attributes.name,
            downloadLink: attributes.url,
            size: attributes.size,
            extension: attributes.ext.replace('.', '').toUpperCase(),
          })),
        }
      : undefined,
    startDateTime: strapiWebinar.attributes.startDatetime?.toISOString(),
    endDateTime: strapiWebinar.attributes.endDatetime?.toISOString(),
    subscribeCtaLabel: strapiWebinar.attributes.subscribeParagraphLabel,
    imagePath: strapiWebinar.attributes.coverImage.data.attributes.url,
    seo: strapiWebinar.attributes.seo,
  };
};

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars
): WebinarsProps {
  return [
    ...strapiWebinars.data.map((webinar) => makeWebinarFromStrapi(webinar)),
  ];
}
