import { Webinar } from '../../types/webinar';
import { StrapiWebinar, StrapiWebinars } from '@/lib/strapi/types/webinars';
import * as webinarsCodec from '@/lib/strapi/codecs/WebinarsCodec';
import _ from 'lodash';

export type WebinarsProps = readonly Webinar[];

export const makeWebinarProps = (
  strapiWebinar: StrapiWebinar
): Webinar | null => {
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

/**
 * @deprecated
 * Use `makeWebinarFromStrapi` instead.
 */
export const deprecatedMakeWebinarFromStrapi = (
  strapiWebinar: webinarsCodec.StrapiWebinars['data'][0]
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
      strapiWebinar.attributes.questionsAndAnswers?.length &&
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
            strapiWebinar.attributes.relatedResources?.downloadableDocuments
              ?.data || []
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
    webinarCategory: strapiWebinar.attributes.webinarCategory?.data?.attributes,
    headerImage: strapiWebinar.attributes.headerImage?.data?.attributes,
    updatedAt: strapiWebinar.attributes.updatedAt?.toISOString(),
  };
};
