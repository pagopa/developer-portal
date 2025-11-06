import { S3Event } from 'aws-lambda';
import { recordingEndedS3EventHandler } from './handlers/recordingEndedJsonHandler';

export const handler = async (event: S3Event) => {
  await recordingEndedS3EventHandler(event);
};
