import { acClient } from '../clients/activeCampaignClient';
import { fetchSubscribedWebinarsFromDynamo } from './fetchSubscribedWebinarsFromDynamo';
import { ActiveCampaignList } from '../types/activeCampaignList';
import { ContactResponseWithLists } from '../types/contactResponse';

export async function getNewWebinarsAndUnsubsriptionLists(
  contactResponse: ContactResponseWithLists,
  cognitoUsername: string
) {
  // eslint-disable-next-line functional/prefer-readonly-type
  const contactLists: ActiveCampaignList[] = [
    ...(await acClient.getLists(
      contactResponse.contactLists
        .filter(({ status }) => status === '1')
        .map(({ list }) => list)
    )),
  ];

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
    const index = contactLists.findIndex(({ name }) => name === webinarSlug);
    if (index) {
      contactLists.splice(index, 1);
    } else {
      newWebinarSlugs.push(webinarSlug);
    }
  });

  const listsToUnsubscribe = contactLists;
  console.log('listsToUnsubscribe:', listsToUnsubscribe); // TODO: Remove after testing
  console.log('New webinar Slugs:', newWebinarSlugs); // TODO: Remove after testing

  return { listsToUnsubscribe, newWebinarSlugs };
}
