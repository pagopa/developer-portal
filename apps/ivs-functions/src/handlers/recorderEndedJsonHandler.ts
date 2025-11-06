import { S3Event, S3EventRecord } from 'aws-lambda';
import { RecordingEndedFile } from '../types/recordingEndedFile';
import { StrapiWebinars } from '../types/strapiWebinars';
import { fetchFromStrapiResponse } from '../helpers/fetchFromStrapiResponse';

const START_STREAMING_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
const FILE_SUFFIX = 'recording-ended.json';

export const mangeS3Event = async (event: S3Event) => {
  console.log('event', JSON.stringify(event, null, 2));
  const targetRecord: S3EventRecord | undefined = event.Records.find((record) =>
    decodeURIComponent(record.s3.object.key.replace(/\+/g, ' ')).endsWith(
      FILE_SUFFIX
    )
  );

  if (!targetRecord) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      '[EndStramingEvent] No recording-ended.json file found in the event records.'
    );
    return;
  }

  try {
    const key = decodeURIComponent(
      targetRecord.s3.object.key.replace(/\+/g, ' ')
    );
    const videoIvsBasePath = process.env.VIDEO_BASE_PATH;
    if (!videoIvsBasePath) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Missing VIDEO_BASE_PATH in environment variables');
    }

    const endRecordingUrl = `${videoIvsBasePath}/${key}`;

    const s3Response = await fetch(endRecordingUrl);

    if (!s3Response.ok) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Failed to fetch recording-ended.json from S3');
    }
    const recordingEndedFile: RecordingEndedFile = await s3Response.json();

    console.log(
      'recordingEndedFile',
      JSON.stringify(recordingEndedFile, null, 2)
    );

    const startStreamingTime = new Date(
      recordingEndedFile.recording_started_at
    ).getTime();
    const hls = recordingEndedFile.media.hls;

    const newPlayerSrc = [
      videoIvsBasePath,
      ...key.split('/').slice(0, -2), // get to base path of VOD removing last two segments
      hls.path,
      hls.playlist,
    ].join('/');

    const strapiWebinarsUrl = `api/webinars?filters[startDatetime][$gte]=${new Date(
      startStreamingTime - START_STREAMING_THRESHOLD_MS
    ).toISOString()}&filters[startDatetime][$lte]=${new Date(
      startStreamingTime + START_STREAMING_THRESHOLD_MS
    ).toISOString()}`;

    const strapiWebinarsResponse: StrapiWebinars =
      await fetchFromStrapiResponse(strapiWebinarsUrl);

    if (strapiWebinarsResponse.meta.pagination.total !== 1) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(
        `Expected to find exactly one webinar for startDatetime around ${recordingEndedFile.recording_started_at}, but found ${strapiWebinarsResponse.meta.pagination.total}`
      );
    }
    const webinar = strapiWebinarsResponse.data[0];

    await fetchFromStrapiResponse(`api/webinars/${webinar.id}`, {
      method: 'PUT',
      body: {
        data: {
          playerSrc: newPlayerSrc,
        },
      },
    });

    return event;
  } catch (error) {
    console.error('[EndStramingEvent] Error:', error);
    return event;
  }
};
