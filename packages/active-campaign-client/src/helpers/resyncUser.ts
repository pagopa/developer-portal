import { deleteContact } from './deleteContact';
import { getUserFromCognitoByUsername } from './getUserFromCognito';
import { fetchSubscribedWebinarsFromDynamo } from './fetchSubscribedWebinarsFromDynamo';
import { addContact } from './addContact';
import { User } from '../types/user';
import { APIGatewayProxyResult } from 'aws-lambda';

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
  /*
  {
    "statusCode": 200,
    "body": "[{\"createdAt\":{\"S\":\"2024-12-05T14:18:28.601Z\"},\"username\":{\"S\":\"56beb230-f081-70a4-f0e1-4b09723b4771\"},\"webinarId\":{\"S\":\"DevTalks-pagoPA-IBAN\"}},{\"createdAt\":{\"S\":\"2024-12-05T14:18:22.429Z\"},\"username\":{\"S\":\"56beb230-f081-70a4-f0e1-4b09723b4771\"},\"webinarId\":{\"S\":\"PagoPALAB-sanita\"}}]"
}
  */
  const webinarIds = JSON.parse(webinars.body)
    .map(
      (webinar: { readonly webinarId: { readonly S: string } }) =>
        webinar?.webinarId?.S
    )
    .filter(Boolean);

  console.log('Webinar IDs:', webinarIds);

  // Step 3: Create user on active campaign
  addContact(user);

  // Step 4: Add user to the webinars lists
  // TBD

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'User resynced' }),
  };
}

/*

{
  "Records": [
    {
      "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
      "receiptHandle": "MessageReceiptHandle",
      "body": "{\"detail\":{\"eventName\":\"ResyncUser\", \"additionalEventData\" : {\"sub\": \"56beb230-f081-70a4-f0e1-4b09723b4771\"}}}",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1523232000000",
        "SenderId": "123456789012",
        "ApproximateFirstReceiveTimestamp": "1523232000001"
      },
      "messageAttributes": {},
      "md5OfBody": "{{{md5_of_body}}}",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-1:123456789012:MyQueue",
      "awsRegion": "us-east-1"
    }
  ]
}
 */
