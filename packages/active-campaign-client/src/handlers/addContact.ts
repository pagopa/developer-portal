import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { SignUpUserData } from 'nextjs-website/src/lib/types/sign-up';
import { ContactPayload } from '../types/contactPayload';

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'body'>;

export async function handler(
  event: HandlerEvent
): Promise<APIGatewayProxyResult> {
  try {
    // Parse request body
    const userData: SignUpUserData = JSON.parse(event.body || '{}');

    // Transform to AC payload
    const acPayload: ContactPayload = {
      contact: {
        email: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fieldValues: [
          {
            field: '2',
            value: userData.company,
          },
          {
            field: '1',
            value: userData.role,
          },
          {
            field: '3',
            value: userData.mailinglistAccepted ? 'TRUE' : 'FALSE',
          },
        ],
      },
    };

    const response = await acClient.createContact(acPayload);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

/*
{
    "fieldOptions": [],
    "fieldRels": [
        {
            "field": "1",
            "relid": "0",
            "dorder": "0",
            "cdate": "2024-11-14T10:47:43-06:00",
            "links": [],
            "id": "1"
        },
        {
            "field": "2",
            "relid": "0",
            "dorder": "0",
            "cdate": "2024-11-14T10:48:31-06:00",
            "links": [],
            "id": "2"
        }
    ],
    "fields": [
        {
            "title": "company",
            "descript": "",
            "type": "text",
            "isrequired": "0",
            "perstag": "COMPANY",
            "defval": "",
            "show_in_list": "0",
            "rows": "0",
            "cols": "0",
            "visible": "1",
            "service": "",
            "ordernum": "1",
            "cdate": "2024-11-14T10:47:43-06:00",
            "udate": "2024-11-14T10:47:43-06:00",
            "created_timestamp": "2024-11-14 10:47:43",
            "updated_timestamp": "2024-11-14 10:47:43",
            "created_by": "1",
            "updated_by": "1",
            "options": [],
            "relations": [
                "1"
            ],
            "links": {
                "options": "https://uqido1728911682.activehosted.com/api/3/fields/1/options",
                "relations": "https://uqido1728911682.activehosted.com/api/3/fields/1/relations"
            },
            "id": "1"
        },
        {
            "title": "role",
            "descript": "",
            "type": "text",
            "isrequired": "0",
            "perstag": "ROLE",
            "defval": "",
            "show_in_list": "0",
            "rows": "0",
            "cols": "0",
            "visible": "1",
            "service": "",
            "ordernum": "2",
            "cdate": "2024-11-14T10:48:31-06:00",
            "udate": "2024-11-14T10:48:31-06:00",
            "created_timestamp": "2024-11-14 10:48:31",
            "updated_timestamp": "2024-11-14 10:48:31",
            "created_by": "1",
            "updated_by": "1",
            "options": [],
            "relations": [
                "2"
            ],
            "links": {
                "options": "https://uqido1728911682.activehosted.com/api/3/fields/2/options",
                "relations": "https://uqido1728911682.activehosted.com/api/3/fields/2/relations"
            },
            "id": "2"
        }
    ],
    "meta": {
        "total": "2",
        "selected": null
    }
}

* */
