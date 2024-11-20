import axios from 'axios';
import * as dotenv from 'dotenv';
import { ContactPayload } from './types/contactPayload';

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

  async getContactByEmail(email: string) {
    const response = await axios.get(`${this.baseUrl}/api/3/contacts`, {
      headers: this.getHeaders(),
      params: { email },
    });
    return response.data?.contacts?.[0]?.id;
  }
}

export const acClient = new ActiveCampaignClient(
  process.env.AC_BASE_URL!,
  process.env.AC_API_KEY!
);
