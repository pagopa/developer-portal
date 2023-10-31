import { PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';

export const handler = async (
  event: PostConfirmationConfirmSignUpTriggerEvent
) => {
  // eslint-disable-next-line functional/no-expression-statements
  console.log('Event', JSON.stringify(event, null, 2));
};
