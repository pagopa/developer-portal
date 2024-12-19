import { User } from '../types/user';
import { makeContactPayload } from './makeContactPayload';
import { acClient } from '../clients/activeCampaignClient';

export async function addOrUpdateContact(user: User) {
  const contactId = await acClient.getContactByCognitoId(user.username);

  const acPayload = makeContactPayload(user);
  const { contact } = contactId
    ? await acClient.updateContact(contactId, acPayload)
    : await acClient.createContact(acPayload);

  return await acClient.getContact(contact.id);
}
