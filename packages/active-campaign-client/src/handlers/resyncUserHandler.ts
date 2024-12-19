import { deleteContact } from '../helpers/deleteContact';
import { getUserFromCognitoByUsername } from '../helpers/getUserFromCognito';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { queueEventParser } from '../helpers/queueEventParser';
import { addOrUpdateContact } from '../helpers/addOrUpdateContact';
import { getNewWebinarsAndUnsubsriptionLists } from '../helpers/getNewWebinarsAndUnsubsriptionLists';
import { addArrayOfListToContact } from '../helpers/addArrayOfListToContact';
import { removeArrayOfListFromContact } from '../helpers/removeArrayOfListFromContact';

export async function resyncUserHandler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const queueEvent = queueEventParser(event);
    const cognitoId = queueEvent.detail.additionalEventData.sub;

    const user = await getUserFromCognitoByUsername(cognitoId);

    if (!user) {
      const deletionResult = await deleteContact(cognitoId); // AC call * 2
      if (
        deletionResult.statusCode != 200 &&
        deletionResult.statusCode != 404
      ) {
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error('Error adding contact');
      }
    } else {
      const contactResponse = await addOrUpdateContact(user); // AC call * 3

      const { listsToUnsubscribe, newWebinarSlugs } =
        await getNewWebinarsAndUnsubsriptionLists(contactResponse, cognitoId); // AC call * 1

      const resyncTimeoutMilliseconds: number = parseInt(
        process.env.AC_RESYNC_TIMEOUT_IN_MS || '1000'
      );

      await addArrayOfListToContact({
        webinarSlugs: newWebinarSlugs,
        cognitoId,
        resyncTimeoutMilliseconds,
      });

      await removeArrayOfListFromContact({
        listsToUnsubscribe,
        contactId: contactResponse.contact.id,
        resyncTimeoutMilliseconds,
      });
    }
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
