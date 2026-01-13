import { acClient } from '../clients/activeCampaignClient';

export async function removeArrayOfListFromContact(event: {
  readonly listsToUnsubscribe: readonly number[];
  readonly contactId: string;
  readonly resyncTimeoutMilliseconds: number;
}) {
  const { listsToUnsubscribe, contactId, resyncTimeoutMilliseconds } = event;
  // eslint-disable-next-line functional/prefer-readonly-type
  const unsubscriptionsWithErrors: string[] = [];
  await listsToUnsubscribe.reduce(
    async (prevPromise: Promise<void>, id: number) => {
      await prevPromise;
      try {
        const result = await acClient.removeContactFromList(contactId, id);
        console.log('Remove contact from list result:', result, id); // TODO: Remove after testing
        await new Promise((resolve) =>
          setTimeout(resolve, resyncTimeoutMilliseconds)
        ); // wait to avoid rate limiting
      } catch {
        unsubscriptionsWithErrors.push(id.toString());
      }
    },
    Promise.resolve()
  );

  if (unsubscriptionsWithErrors.length > 0) {
    console.error(
      'Error removing contact from list',
      unsubscriptionsWithErrors.join(',')
    );
    return false;
  }

  return true;
}
