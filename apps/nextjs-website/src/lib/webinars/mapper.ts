/* eslint-disable functional/no-expression-statements */
import { Webinar } from '@/lib/webinars/types';
import { compact } from 'lodash';
import { StrapiWebinar, StrapiWebinars } from './strapiTypes';

export const mapWebinarProps = (
  strapiWebinar: StrapiWebinar
): Webinar | null => {
  if (!strapiWebinar.slug || !strapiWebinar.title) {
    console.error(
      `Error while processing Webinar: missing title or slug. Title: ${strapiWebinar.title} | Slug: ${strapiWebinar.slug}. Skipping...`
    );
    return null;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
    return {
      ...strapiWebinar,
      speakers:
        strapiWebinar.webinarSpeakers.length > 0
          ? strapiWebinar.webinarSpeakers.map((speaker) => ({
              ...speaker,
              avatar: speaker.avatar,
            }))
          : undefined,
      questionsAndAnswers: strapiWebinar.questionsAndAnswers?.length
        ? strapiWebinar.questionsAndAnswers
        : undefined,
      relatedResources: strapiWebinar.relatedResources
        ? {
            title: strapiWebinar.relatedResources.title,
            resources: (strapiWebinar.relatedResources.resources || []).map(
              (resource) => ({
                ...resource,
                subtitle: resource.subtitle,
                description: resource.description,
                image: resource.image,
              })
            ),
            downloadableDocuments: (
              strapiWebinar.relatedResources.downloadableDocuments || []
            ).map((attributes) => ({
              title: attributes.caption || attributes.name,
              downloadLink: attributes.url,
              size: attributes.size,
              extension: attributes.ext.replace('.', '').toUpperCase(),
            })),
          }
        : undefined,
      startDateTime: strapiWebinar.startDatetime,
      endDateTime: strapiWebinar.endDatetime,
      playerCoverImageUrl: strapiWebinar.playerCoverImage?.url,
      subscribeCtaLabel: strapiWebinar.subscribeParagraphLabel,
      videoOnDemandStartAt: strapiWebinar.videoOnDemandStartAt,
      imagePath: strapiWebinar.coverImage.url,
      seo: strapiWebinar.seo,
      tag: strapiWebinar.webinarCategory,
      headerImage: strapiWebinar.headerImage,
      updatedAt: strapiWebinar.updatedAt,
    } satisfies Webinar;
  } catch (error) {
    console.error(
      `Error while processing Webinar with title ${strapiWebinar.title}:`,
      error,
      'Skipping...'
    );
    return null;
  }
};

export function mapWebinarsProps(
  strapiWebinars: StrapiWebinars
): readonly Webinar[] {
  return compact(
    strapiWebinars.data.map((webinar) => mapWebinarProps(webinar))
  );
}
