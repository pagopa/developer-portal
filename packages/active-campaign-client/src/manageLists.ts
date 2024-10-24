import { Webinar } from 'nextjs-website/src/lib/types/webinar';

//https://developers.activecampaign.com/reference/create-new-list
//listInfo should include all the needed info for the api
//Important: the api returns the id of the list on Active Campaign
export type CreateList = (listInfo: Webinar) => unknown; //torna la risposta
