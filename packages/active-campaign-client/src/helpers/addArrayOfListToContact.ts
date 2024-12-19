import { addContactToList } from './manageListSubscription';

export async function addArrayOfListToContact(event: {
  readonly webinarSlugs: ReadonlyArray<string>;
  readonly cognitoId: string;
  readonly resyncTimeoutMilliseconds: number;
}) {
  const { webinarSlugs, cognitoId, resyncTimeoutMilliseconds } = event;
  // eslint-disable-next-line functional/prefer-readonly-type
  const addWithErrors: string[] = [];
  // add contact to list for each item in subscription lists
  const responses = await webinarSlugs.reduce(
    async (prevPromise: Promise<void>, webinarSlug: string) => {
      await prevPromise;
      try {
        const result = await addContactToList(cognitoId, webinarSlug); // AC call 2 * N
        console.log('Add contact to list result:', result, webinarSlug); // TODO: Remove after testing
        await new Promise((resolve) =>
          setTimeout(resolve, resyncTimeoutMilliseconds)
        ); // wait 1 sec to avoid rate limiting
      } catch (e) {
        addWithErrors.push(webinarSlug);
      }
    },
    Promise.resolve()
  );

  if (addWithErrors.length > 0) {
    console.error('Error adding contact to list', addWithErrors.join(',')); // TODO: Remove after testing
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Error adding contact to list');
  }

  return responses;
}
