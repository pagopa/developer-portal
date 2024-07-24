import { StrapiWebinars } from '@/lib/strapi/webinars';
import { Webinar } from './types/webinar';

export type WebinarsProps = readonly Webinar[];

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars
): WebinarsProps {
  return [
    ...strapiWebinars.data.map((webinar) => ({
      ...webinar.attributes,
      speakers: webinar.attributes.webinarSpeakers.data.map((speaker) => ({
        ...speaker.attributes,
        avatar: speaker.attributes.avatar.data?.attributes,
      })),
      relatedResources: {
        title: webinar.attributes.relatedResources?.title || '',
        resources: (webinar.attributes.relatedResources?.resources || []).map(
          (resource) => ({
            ...resource,
            image: resource.image.data?.attributes,
          })
        ),
        downloadableDocuments: (
          webinar.attributes.relatedResources?.downloadableDocuments.data || []
        ).map(({ attributes }) => ({
          title: attributes.caption || attributes.name,
          downloadLink: attributes.url,
          size: attributes.size,
          extension: attributes.ext.replace('.', '').toUpperCase(),
        })),
      },
      startDateTime: webinar.attributes.startDatetime?.toISOString(),
      endDateTime: webinar.attributes.endDatetime?.toISOString(),
      subscribeCtaLabel: webinar.attributes.subscribeParagraphLabel,
      //TODO: should be removed when this task https://pagopa.atlassian.net/browse/DEV-1524 is resolved
      isVisibleInHome: false,
      imagePath: webinar.attributes.coverImage.data.attributes.url,
    })),
  ];
}
