import { deleteContact } from '../helpers/deleteContact';
import { getUserFromCognitoUsername } from '../helpers/getUserFromCognito';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { queueEventParser } from '../helpers/queueEventParser';
import { addOrUpdateContact } from '../helpers/addOrUpdateContact';
import { getNewWebinarsAndUnsubsriptionLists } from '../helpers/getNewWebinarsAndUnsubsriptionLists';
import { addArrayOfListToContact } from '../helpers/addArrayOfListToContact';
import { removeArrayOfListFromContact } from '../helpers/removeArrayOfListFromContact';

export async function resyncUserHandler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  console.log('resyncUserHandler: Event:', event); // TODO: Remove after testing
  const queueEvent = queueEventParser(event);
  const cognitoUsername = queueEvent.detail.additionalEventData.sub;

  const user = await getUserFromCognitoUsername(cognitoUsername);

  console.log('user:', user); // TODO: Remove after testing

  if (!user) {
    const deletionResult = await deleteContact(cognitoUsername);
    if (
      deletionResult.statusCode !== 200 &&
      deletionResult.statusCode !== 404
    ) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Error deleting contact');
    }
  } else {
    const contactResponse = await addOrUpdateContact(user);

    console.log('contactResponse:', contactResponse); // TODO: Remove after testing

    const { listsToUnsubscribe, newWebinarSlugs } =
      await getNewWebinarsAndUnsubsriptionLists(
        contactResponse,
        cognitoUsername
      );

    const resyncTimeoutMilliseconds: number = parseInt(
      process.env.AC_RESYNC_TIMEOUT_IN_MS || '1000'
    );

    const succesfullyUpdateSubscriptions = await addArrayOfListToContact({
      webinarSlugs: newWebinarSlugs,
      cognitoUsername: cognitoUsername,
      resyncTimeoutMilliseconds,
    });

    const succesfullyUpdateUnsubscriptions = await removeArrayOfListFromContact(
      {
        listsToUnsubscribe,
        contactId: contactResponse.contact.id,
        resyncTimeoutMilliseconds,
      }
    );

    if (!succesfullyUpdateSubscriptions || !succesfullyUpdateUnsubscriptions) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('Error managing list subscriptions');
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User resynced' }),
  };
}
