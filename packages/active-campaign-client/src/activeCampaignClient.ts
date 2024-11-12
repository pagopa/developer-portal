import axios from 'axios';
import {
  ACContactPayload,
  ACListPayload,
  ACListStatusPayload,
} from './activeCampaign';
import * as dotenv from 'dotenv';

// eslint-disable-next-line functional/no-expression-statements
dotenv.config({ path: '.env' });

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

  async getContactByEmail(email: string) {
    const response = await axios.get(`${this.baseUrl}/api/3/contacts`, {
      headers: this.getHeaders(),
      params: { email },
    });
    return response.data?.contacts?.[0]?.id;
  }

  async getListIdByStringId(stringId: string) {
    const response = await axios.get(`${this.baseUrl}/api/3/lists`, {
      headers: this.getHeaders(),
      params: { stringid: stringId },
    });
    return response.data?.lists?.[0]?.id;
  }

  async deleteList(id: number) {
    const response = await axios.delete(`${this.baseUrl}/api/3/lists/${id}`, {
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
  process.env.AC_BASE_URL!,
  process.env.AC_API_KEY!
);
