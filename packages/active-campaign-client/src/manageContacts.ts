//check https://developers.activecampaign.com/reference/contact for informations on the contact api for Active Campaign

//Signup user data is used as a reference for now, if needed, update it with a type we can easily retrieve
import { SignUpUserData } from "nextjs-website/src/lib/types/sign-up";

//https://developers.activecampaign.com/reference/create-a-new-contact
export type AddContact = (contactInfo: SignUpUserData) => unknown;//torna la risposta

//the return value could be the contact id
//https://developers.activecampaign.com/reference/list-all-contacts
//export type FetchContact = (searchQuery: string) => number;

//the contactId is the id used on Active Campaign, which must be retrieved
//https://developers.activecampaign.com/reference/delete-contact
export type DeleteContact = (contactId: string) => unknown;

//https://developers.activecampaign.com/reference/update-a-contact-new
export type UpdateContact = (contactId: string, contactInfo: SignUpUserData) => unknown;

//https://developers.activecampaign.com/reference/update-list-status-for-contact
//status can have 2 values: "1" -> subscribe, "2" -> unsubscribe
export type UpdateListStatus = (listId: string, contactId: string, status: string) => unknown;
