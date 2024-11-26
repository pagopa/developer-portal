import * as https from 'https';
import { ContactPayload } from '../types/contactPayload';
import { ListPayload } from '../types/listPayload';

export class ActiveCampaignClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    // Remove any trailing slashes from the baseUrl
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Api-Token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(
    method: string,
    path: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Parse the base URL to get hostname and path
      const url = new URL(path, this.baseUrl);

      // Add query parameters if they exist
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const options = {
        method,
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        headers: this.getHeaders(),
      };

      const req = https.request(options, (res) => {
        // eslint-disable-next-line functional/no-let
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error('Failed to parse response data'));
            }
          } else {
            reject(
              new Error(`Request failed with status code ${res.statusCode}`)
            );
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async createContact(data: ContactPayload) {
    return this.makeRequest('POST', '/api/3/contacts', data);
  }

  async updateContact(contactId: string, data: ContactPayload) {
    return this.makeRequest('PUT', `/api/3/contacts/${contactId}`, data);
  }

  async deleteContact(contactId: string) {
    return this.makeRequest('DELETE', `/api/3/contacts/${contactId}`);
  }

  async getContactByCognitoId(cognitoId: string) {
    const response = await this.makeRequest<{
      readonly contacts: ReadonlyArray<{ readonly id: string }>;
    }>('GET', '/api/3/contacts', undefined, { phone: `cognito:${cognitoId}` });
    return response?.contacts?.[0]?.id;
  }

  async createList(data: ListPayload) {
    return this.makeRequest('POST', '/api/3/lists', data);
  }

  async getListIdByName(name: string) {
    const response = await this.makeRequest<{
      readonly lists: ReadonlyArray<{ readonly id: number }>;
    }>('GET', '/api/3/lists', undefined, { 'filters[name][eq]': name });
    return response?.lists[0]?.id;
  }

  async deleteList(id: number) {
    return this.makeRequest('DELETE', `/api/3/lists/${id}`);
  }

  async addContactToList(contactId: string, listId: number) {
    return this.makeRequest('POST', `/api/3/contactLists`, {
      contactList: {
        contact: contactId,
        list: listId,
        status: 1, // subscribe
      },
    });
  }

  async removeContactFromList(contactId: string, listId: number) {
    return this.makeRequest('POST', `/api/3/contactLists`, {
      contactList: {
        contact: contactId,
        list: listId,
        status: 2, // unsubscrbe
      },
    });
  }
}

export const acClient = new ActiveCampaignClient(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.AC_BASE_URL!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.AC_API_KEY!
);
