import { Webinar } from '../../types/webinar';
import { StrapiWebinar, StrapiWebinars } from '@/lib/strapi/types/webinars';

export type WebinarsProps = readonly Webinar[];

export const makeWebinarFromStrapi = (
  strapiWebinar: StrapiWebinar
): Webinar => {
  return {
    ...strapiWebinar.attributes,
    speakers:
      strapiWebinar.attributes.webinarSpeakers.data.length > 0
        ? strapiWebinar.attributes.webinarSpeakers.data.map((speaker) => ({
            ...speaker.attributes,
            avatar: speaker.attributes.avatar?.data?.attributes,
          }))
        : undefined,
    questionsAndAnswers: strapiWebinar.attributes.questionsAndAnswers?.length
      ? strapiWebinar.attributes.questionsAndAnswers
      : undefined,
    relatedResources: strapiWebinar.attributes.relatedResources
      ? {
          title: strapiWebinar.attributes.relatedResources.title,
          resources: (
            strapiWebinar.attributes.relatedResources.resources || []
          ).map((resource) => ({
            ...resource,
            subtitle: resource.subtitle,
            description: resource.description,
            image: resource.image?.data?.attributes,
          })),
          downloadableDocuments: (
            strapiWebinar.attributes.relatedResources.downloadableDocuments
              ?.data || []
          ).map(({ attributes }) => ({
            title: attributes.caption || attributes.name,
            downloadLink: attributes.url,
            size: attributes.size,
            extension: attributes.ext.replace('.', '').toUpperCase(),
          })),
        }
      : undefined,
    startDateTime: strapiWebinar.attributes.startDatetime,
    endDateTime: strapiWebinar.attributes.endDatetime,
    subscribeCtaLabel: strapiWebinar.attributes.subscribeParagraphLabel,
    imagePath: strapiWebinar.attributes.coverImage.data.attributes.url,
    seo: strapiWebinar.attributes.seo,
    webinarCategory: strapiWebinar.attributes.webinarCategory?.data?.attributes,
    headerImage: strapiWebinar.attributes.headerImage?.data?.attributes,
    updatedAt: strapiWebinar.attributes.updatedAt,
  } satisfies Webinar;
};

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars
): WebinarsProps {
  return [
    ...strapiWebinars.data.map((webinar) => makeWebinarFromStrapi(webinar)),
  ];
}
