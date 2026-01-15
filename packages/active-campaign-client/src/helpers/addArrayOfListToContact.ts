import { addContactToList } from './manageListSubscription';

export async function addArrayOfListToContact(event: {
  readonly webinarSlugs: ReadonlyArray<string>;
  readonly cognitoUsername: string;
  readonly resyncTimeoutMilliseconds: number;
}) {
  const { webinarSlugs, cognitoUsername, resyncTimeoutMilliseconds } = event;
  // eslint-disable-next-line functional/prefer-readonly-type
  const subscriptionsWithErrors: string[] = [];
  await webinarSlugs.reduce(
    async (prevPromise: Promise<void>, webinarSlug: string) => {
      await prevPromise;
      try {
        const result = await addContactToList(cognitoUsername, webinarSlug);
        console.log('Add contact to list result:', result, webinarSlug); // TODO: Remove after testing
        if (!result.statusCode || result.statusCode !== 200) {
          subscriptionsWithErrors.push(webinarSlug);
        }
        await new Promise((resolve) =>
          setTimeout(resolve, resyncTimeoutMilliseconds)
        ); // wait to avoid rate limiting
      } catch {
        subscriptionsWithErrors.push(webinarSlug);
      }
    },
    Promise.resolve()
  );

  if (subscriptionsWithErrors.length > 0) {
    console.error(
      'Error adding contact to list',
      subscriptionsWithErrors.join(',')
    );
    return false;
  }

  return true;
}
