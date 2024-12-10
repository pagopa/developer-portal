import { deleteContact } from '../helpers/deleteContact';
import { getUserFromCognitoByUsername } from '../helpers/getUserFromCognito';
import { fetchSubscribedWebinarsFromDynamo } from '../helpers/fetchSubscribedWebinarsFromDynamo';
import { addContact } from '../helpers/addContact';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { addContactToList } from '../helpers/manageListSubscription';
import { queueEventParser } from '../helpers/queueEventParser';
import { acClient } from '../clients/activeCampaignClient';
import { bulkAddContactToList } from '../helpers/bulkAddContactsToLists';

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

    const webinarListIds = await Promise.all(
      webinarIds.map(async (webinarId: string) => {
        const listId = await acClient.getListIdByName(webinarId);
        return listId;
      })
    );

    const res = await bulkAddContactToList([user], [webinarListIds]);

    console.log('Res:', res);

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
