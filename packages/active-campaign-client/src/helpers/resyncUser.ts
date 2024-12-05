import { deleteContact } from './deleteContact';
import { getUserFromCognitoByUsername } from './getUserFromCognito';
import { fetchSubscribedWebinarsFromDynamo } from './fetchSubscribedWebinarsFromDynamo';
import { addContact } from './addContact';
import { User } from '../types/user';
import { APIGatewayProxyResult } from 'aws-lambda';
import { addContactToList } from './manageListSubscription';

export async function resyncUser(
  cognitoId: string
): Promise<APIGatewayProxyResult> {
  /*
    La lambda cancella l’utente e, se esiste ancora su Cognito, lo ricrea e lo associa ai webinar corrispondenti (liste su AC).

    Capire se esiste già uno script python (fatto da Christian) che fa la stessa cosa.

  */
  // Step 1: Delete user on active campaign
  const deletionResult = await deleteContact(cognitoId);
  if (deletionResult.statusCode != 200 && deletionResult.statusCode != 404) {
    console.log('Error deleting contact', deletionResult);
    return deletionResult;
  }

  // Step 2: Check if user exists on Cognito
  // eslint-disable-next-line functional/no-let
  let user: User | null = null;

  try {
    user = await getUserFromCognitoByUsername(cognitoId);
  } catch (e) {
    // User not found -> user stays null
  }

  // If the user is not present the sync is done
  if (!user) {
    console.log(`User: ${cognitoId} not present on Cognito, sync done.`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User not present on Cognito, sync done.',
      }),
    };
  }

  // Fetch all the webinars the user is subscribed to
  const webinars = await fetchSubscribedWebinarsFromDynamo(cognitoId);

  const webinarIds = JSON.parse(webinars.body)
    .map(
      (webinar: { readonly webinarId: { readonly S: string } }) =>
        webinar?.webinarId?.S
    )
    .filter(Boolean);

  console.log('Webinar IDs:', webinarIds);

  // Step 3: Create user on active campaign
  const res = await addContact(user);
  console.log('Add contact result:', res);

  // Step 4: Add user to the webinars lists
  // eslint-disable-next-line functional/no-loop-statements
  for (const webinarId of webinarIds) {
    console.log('Adding contact to list:', webinarId);
    try {
      const result = await addContactToList(cognitoId, webinarId);
      console.log('Add contact to list result:', result);
      // wait 1 sec to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.error('Error adding contact to list', e);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User resynced' }),
  };
}
