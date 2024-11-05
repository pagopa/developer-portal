/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { validateCognitoToken } from '../cognito';
import { Webinar } from 'nextjs-website/src/lib/types/webinar';
import { ACListPayload } from '../activeCampaign';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    // Validate authorization
    const token = event.headers.Authorization;
    if (!token || !(await validateCognitoToken(token))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const webinarData: Webinar = JSON.parse(event.body || '{}');

    const acPayload: ACListPayload = {
      list: {
        name: webinarData.title,
        stringid: webinarData.slug, // Using slug as the stringid
        sender_url: process.env.SENDER_URL || '',
        sender_reminder: webinarData.subscribeCtaLabel || '',
        subscription_notify: '',
        unsubscription_notify: '',
      },
    };

    const response = await acClient.createList(acPayload);

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
