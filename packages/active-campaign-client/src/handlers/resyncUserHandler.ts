import { deleteContact } from '../helpers/deleteContact';
import { getUserFromCognitoUsername } from '../helpers/getUserFromCognito';
import { getSubscribedWebinars } from '../helpers/getSubscribedWebinars';
import { addContact } from '../helpers/addContact';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { addContactToList } from '../helpers/manageListSubscription';
import { queueEventParser } from '../helpers/queueEventParser';

export async function resyncUserHandler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const queueEvent = queueEventParser(event);
    const cognitoUsername = queueEvent.detail.additionalEventData.sub;
    const deletionResult = await deleteContact(cognitoUsername);
    if (
      deletionResult.statusCode !== 200 &&
      deletionResult.statusCode !== 404
    ) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Error adding contact');
    }

    const user = await getUserFromCognitoUsername(cognitoUsername);

    if (!user) {
      console.log(
        `User: ${cognitoUsername} not present on Cognito, sync done.`
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'User not present on Cognito, sync done.',
        }),
      };
    }

    const userWebinarsSubscriptions = await getSubscribedWebinars(
      cognitoUsername
    );

    const webinarIds = JSON.parse(userWebinarsSubscriptions.body)
      .map(
        (webinar: { readonly webinarId: { readonly S: string } }) =>
          webinar?.webinarId?.S
      )
      .filter(Boolean);

    const res = await addContact(user);
    if (res.statusCode !== 200) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Error adding contact');
    }

    await webinarIds.reduce(
      async (
        prevPromise: Promise<APIGatewayProxyResult>,
        webinarId: string
      ) => {
        await prevPromise;
        try {
          const result = await addContactToList(cognitoUsername, webinarId);
          console.log('Add contact to list result:', result, webinarId); // TODO: Remove after testing
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 sec to avoid rate limiting
        } catch (e) {
          console.error('Error adding contact to list', e); // TODO: Remove after testing
        }
      },
      Promise.resolve()
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User resynced' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
}
