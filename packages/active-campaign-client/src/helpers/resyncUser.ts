import { deleteContact } from './deleteContact';
import { getUserFromCognitoByUsername } from './getUserFromCognito';
import { fetchSubscribedWebinarsFromDynamo } from './fetchSubscribedWebinarsFromDynamo';
import { addContact } from './addContact';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { addContactToList } from './manageListSubscription';
import { queueEventParser } from './queueEventParser';

export async function resyncUserHandler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const queueEvent = queueEventParser(event);
    const cognitoId = queueEvent.detail.additionalEventData.sub;
    const deletionResult = await deleteContact(cognitoId);
    if (deletionResult.statusCode != 200 && deletionResult.statusCode != 404) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Error adding contact');
    }

    const user = await getUserFromCognitoByUsername(cognitoId);

    if (!user) {
      console.log(`User: ${cognitoId} not present on Cognito, sync done.`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'User not present on Cognito, sync done.',
        }),
      };
    }

    const userWebinarsSubscriptions = await fetchSubscribedWebinarsFromDynamo(
      cognitoId
    );

    const webinarIds = JSON.parse(userWebinarsSubscriptions.body)
      .map(
        (webinar: { readonly webinarId: { readonly S: string } }) =>
          webinar?.webinarId?.S
      )
      .filter(Boolean);

    console.log('Webinar IDs:', webinarIds); // TODO: Remove after testing

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
          const result = await addContactToList(cognitoId, webinarId);
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

