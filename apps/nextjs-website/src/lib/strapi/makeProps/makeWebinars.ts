import { StrapiWebinars } from '@/lib/strapi/codecs/WebinarsCodec';
import { Webinar } from '../../types/webinar';

export type WebinarsProps = readonly Webinar[];

export const makeWebinarFromStrapi = (
  webinar: StrapiWebinars['data'][0]
): Webinar => {
  return {
    ...webinar.attributes,
    speakers:
      webinar.attributes.webinarSpeakers.data.length > 0
        ? webinar.attributes.webinarSpeakers.data.map((speaker) => ({
            ...speaker.attributes,
            avatar: speaker.attributes.avatar.data?.attributes,
          }))
        : undefined,
    questionsAndAnswers:
      webinar.attributes.questionsAndAnswers.length > 0
        ? webinar.attributes.questionsAndAnswers
        : undefined,
    relatedResources: webinar.attributes.relatedResources
      ? {
          title: webinar.attributes.relatedResources.title,
          resources: (webinar.attributes.relatedResources.resources || []).map(
            (resource) => ({
              ...resource,
              image: resource.image.data?.attributes,
            })
          ),
          downloadableDocuments: (
            webinar.attributes.relatedResources.downloadableDocuments.data || []
          ).map(({ attributes }) => ({
            title: attributes.caption || attributes.name,
            downloadLink: attributes.url,
            size: attributes.size,
            extension: attributes.ext.replace('.', '').toUpperCase(),
          })),
        }
      : undefined,
    startDateTime: webinar.attributes.startDatetime?.toISOString(),
    endDateTime: webinar.attributes.endDatetime?.toISOString(),
    subscribeCtaLabel: webinar.attributes.subscribeParagraphLabel,
    imagePath: webinar.attributes.coverImage.data.attributes.url,
  };
};

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars
): WebinarsProps {
  return [
    ...strapiWebinars.data.map((webinar) => makeWebinarFromStrapi(webinar)),
  ];
}
