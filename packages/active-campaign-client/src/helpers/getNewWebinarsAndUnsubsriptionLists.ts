import { acClient } from '../clients/activeCampaignClient';
import { fetchSubscribedWebinarsFromDynamo } from './fetchSubscribedWebinarsFromDynamo';
import { ContactResponseWithLists } from '../types/contactResponse';

export async function getNewWebinarsAndUnsubsriptionLists(
  contactResponse: ContactResponseWithLists,
  cognitoUsername: string
) {
  const idsParams = contactResponse.contactLists
    .filter(({ status }) => status === '1')
    .map(({ list }) => list);

  console.log('idsParams:', idsParams); // TODO: Remove after testing
  const getListResponse = await acClient.getLists(idsParams);

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
  // eslint-disable-next-line functional/prefer-readonly-type
  const contactLists: { name: string; id: string }[] =
    getListResponse.lists.map(({ name, id }) => ({ name, id }));

  webinarSlugs.forEach((webinarSlug) => {
    const index = contactLists.findIndex(({ name }) => name === webinarSlug);
    if (index >= 0) {
      contactLists.splice(index, 1);
    } else {
      newWebinarSlugs.push(webinarSlug);
    }
  });

  const listsToUnsubscribe: readonly number[] = contactLists.map(({ id }) =>
    Number(id)
  );
  console.log('listsToUnsubscribe:', listsToUnsubscribe); // TODO: Remove after testing
  console.log('New webinar Slugs:', newWebinarSlugs); // TODO: Remove after testing

  return { listsToUnsubscribe, newWebinarSlugs };
}
