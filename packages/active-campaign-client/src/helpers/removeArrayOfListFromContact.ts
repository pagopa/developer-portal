import { acClient } from '../clients/activeCampaignClient';

export async function removeArrayOfListFromContact(event: {
  readonly listsToUnsubscribe: readonly number[];
  readonly cognitoUsername: string;
  readonly resyncTimeoutMilliseconds: number;
}) {
  const { listsToUnsubscribe, cognitoUsername, resyncTimeoutMilliseconds } =
    event;
  // remove contact from list for each item in unsubscription lists
  await listsToUnsubscribe.reduce(
    async (prevPromise: Promise<void>, id: number) => {
      await prevPromise;
      // AC call * M
      const result = await acClient.removeContactFromList(cognitoUsername, id);
      console.log('Remove contact from list result:', result, id); // TODO: Remove after testing
      await new Promise((resolve) =>
        setTimeout(resolve, resyncTimeoutMilliseconds)
      ); // wait 1 sec to avoid rate limiting
    },
    Promise.resolve()
  );
}
