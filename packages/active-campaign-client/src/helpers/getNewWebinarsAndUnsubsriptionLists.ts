import { acClient } from '../clients/activeCampaignClient';
import { fetchSubscribedWebinarsFromDynamo } from './fetchSubscribedWebinarsFromDynamo';
import { ContactResponseWithLists } from '../types/contactResponse';

const AC_STATUS_SUBSCRIBED = '1';

export async function getNewWebinarsAndUnsubsriptionLists(
  contactResponse: ContactResponseWithLists,
  cognitoUsername: string
) {
  const listIds = contactResponse.contactLists
    .filter(({ status }) => status === AC_STATUS_SUBSCRIBED)
    .map(({ list }) => list);

  console.log('idsParams:', listIds); // TODO: Remove after testing
  const getListResponse = await acClient.getLists(listIds);
  // eslint-disable-next-line functional/prefer-readonly-type
  const contactCurrentlySubscribedLists: { name: string; id: string }[] =
    getListResponse.lists.map(({ name, id }) => ({ name, id }));

  const userWebinarsSubscriptions = await fetchSubscribedWebinarsFromDynamo(
    cognitoUsername
  );

  const webinarSlugs: readonly string[] = JSON.parse(
    userWebinarsSubscriptions.body
  )
    .map(
      (webinar: { readonly webinarId: { readonly S: string } }) =>
        webinar?.webinarId?.S
    )
    .filter(Boolean);

  // eslint-disable-next-line functional/prefer-readonly-type
  const newWebinarSlugs: string[] = [];

  webinarSlugs.forEach((webinarSlug) => {
    const index = contactCurrentlySubscribedLists.findIndex(
      ({ name }) => name === webinarSlug
    );
    if (index >= 0) {
      contactCurrentlySubscribedLists.splice(index, 1);
    } else {
      newWebinarSlugs.push(webinarSlug);
    }
  });

  const listsToUnsubscribe: readonly number[] =
    contactCurrentlySubscribedLists.map(({ id }) => Number(id));
  console.log('listsToUnsubscribe:', listsToUnsubscribe); // TODO: Remove after testing
  console.log('New webinar Slugs:', newWebinarSlugs); // TODO: Remove after testing

  return { listsToUnsubscribe, newWebinarSlugs };
}
