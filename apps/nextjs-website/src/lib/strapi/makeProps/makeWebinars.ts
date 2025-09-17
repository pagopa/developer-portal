/* eslint-disable functional/no-expression-statements */
import { Webinar } from '../../types/webinar';
import { StrapiWebinar, StrapiWebinars } from '@/lib/strapi/types/webinars';
import _ from 'lodash';

export type WebinarsProps = readonly Webinar[];

export const makeWebinarProps = (
  strapiWebinar: StrapiWebinar
): Webinar | null => {
  if (!strapiWebinar.attributes.slug || !strapiWebinar.attributes.title) {
    // eslint-disable-next-line functional/no-let
    let message: string;
    if (!strapiWebinar.attributes.title && !strapiWebinar.attributes.slug) {
      message = `Webinar is missing both title and slug. Skipping...`;
    } else if (!strapiWebinar.attributes.slug) {
      message = `Webinar with title "${strapiWebinar.attributes.title}" is missing the webinar slug. Skipping...`;
    } else {
      message = `Webinar with slug "${strapiWebinar.attributes.slug}" is missing the title. Skipping...`;
    }
    console.error(message);
    return null;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
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
      webinarCategory:
        strapiWebinar.attributes.webinarCategory?.data?.attributes,
      headerImage: strapiWebinar.attributes.headerImage?.data?.attributes,
      updatedAt: strapiWebinar.attributes.updatedAt,
    } satisfies Webinar;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Error while making webinar from Strapi data:', error);
    return null;
  }
};

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars
): WebinarsProps {
  return _.compact([
    ...strapiWebinars.data.map((webinar) => makeWebinarProps(webinar)),
  ]);
}
