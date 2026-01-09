import * as https from 'https';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { ContactPayload } from '../types/contactPayload';
import { ListPayload } from '../types/listPayload';
import { ListStatusPayload } from '../types/listStatusPayload';
import { BulkAddContactPayload } from '../types/bulkAddContactPayload';
import {
  ContactResponse,
  ContactResponseWithLists,
} from '../types/contactResponse';
import { ActiveCampaignList } from '../types/activeCampaignList';

const MAX_NUMBER_OF_LISTS = '1000';

function getSizeInKB(obj: unknown): number {
  const objectAsString = JSON.stringify(obj);
  const sizeInBytes = new Blob([objectAsString]).size;
  return sizeInBytes / 1024;
}

async function getParameter(
  paramName: string,
  ssmClient: SSMClient,
  fallbackValue?: string
) {
  // TODO: remove fallbackValue only for testing purposes should be substituted by a mock function
  if (fallbackValue) {
    return fallbackValue;
  }
  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: true, // Use this if the parameter is encrypted
  });
  const response = await ssmClient.send(command);

  return response.Parameter?.Value;
}

export class ActiveCampaignClient {
  private readonly baseUrlParam: string;
  private readonly apiKeyParam: string;

  private readonly ssm = new SSMClient();

  constructor(baseUrlParam?: string, apiKeyParam?: string) {
    this.baseUrlParam = baseUrlParam || '';
    this.apiKeyParam = apiKeyParam || '';
  }

  private getHeaders(apiKey: string) {
    return {
      'Api-Token': apiKey,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(
    method: string,
    path: string,
    data?:
      | ContactPayload
      | ListPayload
      | ListStatusPayload
      | BulkAddContactPayload,
    params?: Record<string, string>
  ): Promise<T> {
    const [apiKey, baseUrl] = await Promise.all([
      // Fallback env variable exists only for manual testing purposes
      getParameter(this.apiKeyParam, this.ssm, process.env.TEST_AC_API_KEY),
      getParameter(this.baseUrlParam, this.ssm, process.env.TEST_AC_BASE_URL),
    ]);
    return new Promise((resolve, reject) => {
      // Parse the base URL to get hostname and path and remove any trailing slashes from the baseUrl
      const url = new URL(path, baseUrl?.replace(/\/$/, ''));

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
        headers: this.getHeaders(apiKey || ''),
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
            } catch {
              reject(new Error('Failed to parse response data'));
            }
          } else {
            console.log('Request failed', data);
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
    return this.makeRequest<ContactResponse>('POST', '/api/3/contacts', data);
  }

  async updateContact(contactId: string, data: ContactPayload) {
    return this.makeRequest<ContactResponse>(
      'PUT',
      `/api/3/contacts/${contactId}`,
      data
    );
  }

  async deleteContact(contactId: string) {
    return this.makeRequest('DELETE', `/api/3/contacts/${contactId}`);
  }

  async getContactByCognitoUsername(cognitoUsername: string) {
    const response = await this.makeRequest<{
      readonly contacts: ReadonlyArray<{ readonly id: string }>;
    }>('GET', '/api/3/contacts', undefined, {
      phone: `cognito:${cognitoUsername}`,
    });
    return response?.contacts?.[0]?.id;
  }

  async getContact(id: string) {
    return await this.makeRequest<ContactResponseWithLists>(
      'GET',
      `/api/3/contacts/${id}`
    );
  }

  async createList(data: ListPayload) {
    return this.makeRequest('POST', '/api/3/lists', data);
  }

  async getListIdByName(name: string): Promise<number | undefined> {
    const response = await this.makeRequest<{
      readonly lists: ReadonlyArray<{ readonly id: number }>;
    }>('GET', '/api/3/lists', undefined, { 'filters[name][eq]': name });
    return response?.lists[0]?.id;
  }

  async deleteList(id: number) {
    return this.makeRequest('DELETE', `/api/3/lists/${id}`);
  }

  async getLists(ids?: readonly string[]) {
    const limitParams = { limit: MAX_NUMBER_OF_LISTS };
    return this.makeRequest<{ readonly lists: readonly ActiveCampaignList[] }>(
      'GET',
      '/api/3/lists',
      undefined,
      ids && ids.length > 0
        ? { ids: ids.join(','), ...limitParams }
        : limitParams
    );
  }

  async bulkAddContactToList(
    contacts: readonly (ContactPayload & {
      readonly listIds: readonly number[];
    })[]
  ) {
    const body = {
      contacts: contacts.map((payload) => ({
        email: payload.contact.email,
        first_name: payload.contact.firstName,
        last_name: payload.contact.lastName,
        phone: payload.contact.phone,
        customer_acct_name: payload.contact.lastName,
        fields: payload.contact.fieldValues
          .filter((field) => field.value)
          .map((field) => ({
            id: Number(field.field),
            value: field.value,
          })),
        subscribe: payload.listIds.map((listId) => ({ listid: listId })),
      })),
    };

    const sizeInKB = getSizeInKB(body);
    console.log(`Size in KB: ${sizeInKB.toFixed(2)} KB`);
    return this.makeRequest('POST', `/api/3/import/bulk_import`, body);
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
  process.env.AC_BASE_URL_PARAM,
  process.env.AC_API_KEY_PARAM
);
