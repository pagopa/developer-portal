/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-this-expressions */
/* eslint-disable functional/no-classes */
import axios from 'axios';
import {
  ACContactPayload,
  ACListPayload,
  ACListStatusPayload,
} from './activeCampaign';

export class ActiveCampaignClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Api-Token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async createContact(data: ACContactPayload) {
    const response = await axios.post(`${this.baseUrl}/api/3/contacts`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateContact(contactId: string, data: ACContactPayload) {
    const response = await axios.put(
      `${this.baseUrl}/api/3/contacts/${contactId}`,
      data,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async deleteContact(contactId: string) {
    const response = await axios.delete(
      `${this.baseUrl}/api/3/contacts/${contactId}`,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async createList(data: ACListPayload) {
    const response = await axios.post(`${this.baseUrl}/api/3/lists`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateListStatus(data: ACListStatusPayload) {
    const response = await axios.post(
      `${this.baseUrl}/api/3/contactLists`,
      data,
      { headers: this.getHeaders() }
    );
    return response.data;
  }
}

export const acClient = new ActiveCampaignClient(
  process.env.AC_BASE_URL || 'https://uqido1728911682.activehosted.com',
  process.env.AC_API_KEY ||
    'c9d193d287bd1e5e7f8dc5a6a8ec673d4c1d48bf4d84abd440d4f33cc405f78828f1d0e9'
);
