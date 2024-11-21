import axios from 'axios';
import * as dotenv from 'dotenv';
import { ContactPayload } from '../types/contactPayload';
import { ListPayload } from '../types/listPayload';

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

  async createContact(data: ContactPayload) {
    const response = await axios.post(`${this.baseUrl}/api/3/contacts`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateContact(contactId: string, data: ContactPayload) {
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

  async getContactByCognitoId(cognitoId: string) {
    const response = await axios.get(`${this.baseUrl}/api/3/contacts`, {
      headers: this.getHeaders(),
      params: { phone: `cognito:${cognitoId}` },
    });
    return response.data?.contacts?.[0]?.id;
  }

  async createList(data: ListPayload) {
    const response = await axios.post(`${this.baseUrl}/api/3/lists`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getListIdByName(name: string) {
    const response = await axios.get(`${this.baseUrl}/api/3/lists`, {
      headers: this.getHeaders(),
      params: { 'filters[name][eq]': name },
    });
    return response.data?.lists[0]?.id;
  }

  async deleteList(id: number) {
    const response = await axios.delete(`${this.baseUrl}/api/3/lists/${id}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

export const acClient = new ActiveCampaignClient(
  process.env.AC_BASE_URL!,
  process.env.AC_API_KEY!
);
