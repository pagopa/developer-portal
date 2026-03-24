/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { Webinar } from '../../types/webinar';
import { StrapiWebinar, StrapiWebinars } from '@/lib/strapi/types/webinars';
import { compact } from 'lodash';

export type WebinarsProps = readonly Webinar[];

function generateVTTContent(chapters: Webinar['chapters']): string {
  if (!chapters || chapters.length === 0) {
    return '';
  }

  const vttLines = ['WEBVTT\n'];
  chapters.forEach((chapter, index) => {
    const cueIndex = index + 1;
    vttLines.push(`${cueIndex}`);
    vttLines.push(`${chapter.startTime} --> ${chapter.endTime}`);
    vttLines.push(`${chapter.title}\n`);
  });

  return vttLines.join('\n');
}

// TODO: only a POC, relative fields must be added to strapi and remove this mock before merge
const MOCK_CHAPTERS = [
  {
    startTime: '00:00:00.000',
    endTime: '00:12:15.000',
    title: 'Introduzione',
  },
  {
    startTime: '00:12:15.000',
    endTime: '00:25:30.000',
    title: 'Panoramica generale',
  },
  {
    startTime: '00:25:30.000',
    endTime: '00:40:45.000',
    title: 'Dimostrazione',
  },
];

export const makeWebinarProps = (
  strapiWebinar: StrapiWebinar
): Webinar | null => {
  if (!strapiWebinar.attributes.slug || !strapiWebinar.attributes.title) {
    console.error(
      `Error while processing Webinar: missing title or slug. Title: ${strapiWebinar.attributes.title} | Slug: ${strapiWebinar.attributes.slug}. Skipping...`
    );
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
      playerCoverImageUrl:
        strapiWebinar.attributes.playerCoverImage?.data?.attributes.url,
      videoOnDemandStartAt: strapiWebinar.attributes.videoOnDemandStartAt,
      subscribeCtaLabel: strapiWebinar.attributes.subscribeParagraphLabel,
      imagePath: strapiWebinar.attributes.coverImage.data.attributes.url,
      seo: strapiWebinar.attributes.seo,
      tag: strapiWebinar.attributes.webinarCategory?.data?.attributes,
      headerImage: strapiWebinar.attributes.headerImage?.data?.attributes,
      updatedAt: strapiWebinar.attributes.updatedAt,
      chapters: MOCK_CHAPTERS,
      webvttContent: generateVTTContent(MOCK_CHAPTERS),
    } satisfies Webinar;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `Error while processing Webinar with title ${strapiWebinar.attributes.title}:`,
      error,
      'Skipping...'
    );
    return null;
  }
};

export function makeWebinarsProps(
  strapiWebinars: StrapiWebinars
): WebinarsProps {
  return compact([
    ...strapiWebinars.data.map((webinar) => makeWebinarProps(webinar)),
  ]);
}
