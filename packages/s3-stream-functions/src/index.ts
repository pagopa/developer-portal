import { S3Event } from 'aws-lambda';
import { mangeS3Event } from './handlers/recorderEndedJsonHandler';

export const handler = async (event: S3Event) => {
  await mangeS3Event(event);
};
